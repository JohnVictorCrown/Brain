package mail

import (
	"crypto/tls"
	"fmt"
	"io"
	"net/mail"
	"regexp"
	"strings"

	"github.com/emersion/go-imap"
	"github.com/emersion/go-imap/client"

	"counter-terrorism-initiative/internal/db"
)

// BounceVerdict classifies a delivery failure for one recipient.
type BounceVerdict string

const (
	VerdictInvalid BounceVerdict = "invalid" // address does not exist — safe to delete
	VerdictBlocked BounceVerdict = "blocked" // rejected for policy/spam/security — do NOT delete
	VerdictOther   BounceVerdict = "other"   // transient or unclear — do NOT delete
)

// Bounce holds one failed recipient extracted from a Mailer-Daemon message.
type Bounce struct {
	Email   string        `json:"email"`
	Verdict BounceVerdict `json:"verdict"`
	Reason  string        `json:"reason"`
	UID     uint32        `json:"uid,omitempty"`
}

// Daemon senders used by Gmail for delivery failures.
var daemonSenders = []string{
	"mailer-daemon@googlemail.com",
	"mailer-daemon@gmail.com",
}

var emailRe = regexp.MustCompile(`[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}`)

// blockedMarkers: if any is present the failure is a policy/spam/security
// block, NOT a bad address. These take precedence over invalid markers.
var blockedMarkers = []string{
	"blocked",
	"blacklist",
	"blacklisted",
	"spam",
	"unsolicited",
	"bulk mail",
	"policy",
	"prohibited",
	"administrative prohibition",
	"content rejected",
	"message rejected",
	"rejected due to",
	"sender rejected",
	"client host rejected",
	"ptr record",
	"reverse dns",
	"dmarc",
	"spf",
	"dkim",
	"authentication",
	"suspicious",
	"phishing",
	"malware",
	"virus",
	"denied",
	"deferred",
	"temporarily",
	"greylist",
	"greylisted",
	"rate limit",
	"rate-limited",
	"too many",
	"quota",
	"over quota",
	"mailbox full",
	"storage exceeded",
	"timed out",
	"timeout",
	"connection",
	"network",
	"unreachable",
	"loop",
}

// invalidMarkers: hard-bounce signals meaning the address itself is bad.
var invalidMarkers = []string{
	"user unknown",
	"unknown user",
	"address not found",
	"recipient not found",
	"mailbox unavailable",
	"mailbox not found",
	"mailbox unavailable",
	"no such user",
	"no such mailbox",
	"no mailbox",
	"bad destination",
	"invalid recipient",
	"invalid address",
	"address unknown",
	"recipient unknown",
	"does not exist",
	"not exist",
	"undeliverable",
	"permanent failure",
	"550-5.1.1",
	"550 5.1.1",
	"5.1.1",
	"550-5.1.2",
	"550 5.1.2",
	"5.1.2",
	"553-5.1.2",
	"553 5.1.2",
	"550-5.2.1",
	"550 5.2.1",
	"5.2.1",
}

// markerHits returns which markers from the list appear in text (lowercased).
func markerHits(lower string, markers []string) []string {
	var hits []string
	for _, m := range markers {
		if strings.Contains(lower, m) {
			hits = append(hits, m)
		}
	}
	return hits
}

// diagnosticSection extracts only the machine-generated DSN lines
// (Diagnostic-Code / Status / Action / recipient fields). This matters because
// Gmail appends a generic DMARC/SPF/DKIM advisory footer to EVERY bounce —
// scanning the whole body for policy words would mislabel genuine hard
// bounces (e.g. "550 5.1.1 User Unknown") as blocked.
func diagnosticSection(raw string) string {
	var b strings.Builder
	for _, line := range strings.Split(raw, "\n") {
		t := strings.TrimSpace(line)
		lt := strings.ToLower(t)
		if strings.HasPrefix(lt, "diagnostic-code:") ||
			strings.HasPrefix(lt, "status:") ||
			strings.HasPrefix(lt, "action:") ||
			strings.HasPrefix(lt, "final-recipient:") ||
			strings.HasPrefix(lt, "original-recipient:") {
			b.WriteString(t)
			b.WriteString("\n")
		}
	}
	return b.String()
}

// ClassifyBounce decides invalid vs blocked vs other from the raw DSN text.
// Evidence hierarchy (conservative — ambiguous is always kept):
//  1. Enhanced status code inside the diagnostic section:
//     5.1.1/5.1.2/5.1.3/5.1.6/5.1.7/5.2.1/NXDOMAIN/No Such User/User Unknown
//     in the diagnostic line = invalid address.
//     5.7.x (security/policy) = blocked even if address words appear nearby.
//     5.4.x (e.g. Exchange "Access denied") = blocked (kept — ambiguous).
//     5.1.0 bare "Address rejected" with no detail = other (kept).
//     4xx = transient = other (kept).
//  2. Fallback: whole-body marker scan (old behavior) when no diagnostic
//     section exists. Blocked wins ties here.
func ClassifyBounce(raw string) (BounceVerdict, string) {
	diag := diagnosticSection(raw)
	if strings.TrimSpace(diag) != "" {
		if v, reason, ok := classifyDiagnostic(diag); ok {
			return v, reason
		}
	}
	// Fallback scans only the relevant sections: the human-readable
	// explanation plus the machine DSN. Transport headers, DKIM/ARC
	// signatures, HTML and attachments are excluded — they contain
	// authentication words (dmarc/spf/dkim) on EVERY Gmail bounce and
	// would otherwise launder genuine address failures into "blocked".
	rel := relevantBody(raw)
	lower := strings.ToLower(rel)
	blockedHits := markerHits(lower, blockedMarkers)
	invalidHits := markerHits(lower, invalidMarkers)
	if len(blockedHits) > 0 && len(invalidHits) > 0 {
		return VerdictBlocked, fmt.Sprintf(
			"BOTH policy+address markers present — kept for manual review (blocked: %s; invalid: %s)",
			strings.Join(blockedHits, ","), strings.Join(invalidHits, ","))
	}
	if len(blockedHits) > 0 {
		return VerdictBlocked, "matched blocked marker: " + blockedHits[0]
	}
	if len(invalidHits) > 0 {
		return VerdictInvalid, "matched invalid marker: " + invalidHits[0]
	}
	// Bare 5xx permanent codes without policy context are invalid;
	// 4xx are transient.
	if strings.Contains(lower, " 550 ") || strings.Contains(lower, "550-") ||
		strings.Contains(lower, " 553 ") || strings.Contains(lower, "553-") ||
		strings.Contains(lower, " 554 ") || strings.Contains(lower, "554-") {
		return VerdictInvalid, "permanent 5xx failure"
	}
	if strings.Contains(lower, " 421 ") || strings.Contains(lower, " 450 ") ||
		strings.Contains(lower, " 451 ") || strings.Contains(lower, " 452 ") {
		return VerdictOther, "transient 4xx failure"
	}
	return VerdictOther, "unclear reason"
}

// classifyDiagnostic applies the evidence hierarchy to the DSN diagnostic
// lines only. Returns ok=false when the diagnostic section is inconclusive
// (caller falls back to the whole-body scan).
func classifyDiagnostic(diag string) (BounceVerdict, string, bool) {
	lower := strings.ToLower(diag)

	// NXDOMAIN on the recipient domain: the domain does not exist, so the
	// address cannot receive mail. Genuinely invalid.
	if strings.Contains(lower, "nxdomain") {
		return VerdictInvalid, "diagnostic: recipient domain NXDOMAIN (does not exist)", true
	}

	// Enhanced status code decides when present.
	if m := statusRe.FindStringSubmatch(diag); m != nil {
		code := m[1] + "-" + m[2] // e.g. 550-5.1.1
		enh := m[2]               // e.g. 5.1.1
		switch {
		case strings.HasPrefix(enh, "5.7."):
			return VerdictBlocked, "diagnostic: policy/security status " + code, true
		case strings.HasPrefix(enh, "5.4."):
			// e.g. Exchange "550 5.4.1 Access denied": often unknown
			// recipient, but also used for policy — ambiguous, keep.
			return VerdictBlocked, "diagnostic: ambiguous relay status " + code + " — kept", true
		case enh == "5.1.0":
			// Bare "Address rejected" with no detail — ambiguous, keep.
			return VerdictOther, "diagnostic: generic status " + code + " — kept as unclear", true
		case (strings.HasPrefix(enh, "5.1.") && enh != "5.1.0") || enh == "5.2.1":
			// 5.1.1/5.1.2/5.1.3/5.1.6/5.1.7 addressing failures, 5.2.1
			// mailbox disabled. Invalid address. (5.1.0 is handled
			// above as ambiguous; 5.3.0 is undefined — falls through.)
			return VerdictInvalid, "diagnostic: addressing status " + code, true
		case strings.HasPrefix(enh, "4."):
			return VerdictOther, "diagnostic: transient status " + code, true
		}
	}

	// No usable code: policy words inside the diagnostic line itself mean a
	// genuine policy rejection (not the Gmail footer, which lives outside it).
	if hits := markerHits(lower, blockedMarkers); len(hits) > 0 {
		return VerdictBlocked, "diagnostic: policy marker: " + hits[0], true
	}
	// Hard address-failure language inside the diagnostic line itself.
	if hits := markerHits(lower, invalidMarkers); len(hits) > 0 {
		return VerdictInvalid, "diagnostic: address marker: " + hits[0], true
	}
	return "", "", false
}

// extractFailedRecipients pulls candidate failed addresses from a DSN body.
// It prefers structured Final-Recipient / X-Failed-Recipients headers, then
// falls back to delivery-failure sentences, and only as a last resort scans
// all emails minus our own address and the daemon address.
func extractFailedRecipients(body, self string) []string {
	var out []string
	seen := map[string]bool{}
	add := func(e string) {
		e = strings.TrimSpace(strings.Trim(e, "<>.,;:\"'()[]"))
		if e == "" || seen[strings.ToLower(e)] {
			return
		}
		lower := strings.ToLower(e)
		if lower == strings.ToLower(self) || strings.HasPrefix(lower, "mailer-daemon@") {
			return
		}
		seen[lower] = true
		out = append(out, e)
	}

	selfLower := strings.ToLower(self)

	// 1. Structured DSN fields.
	for _, line := range strings.Split(body, "\n") {
		t := strings.TrimSpace(line)
		lt := strings.ToLower(t)
		if strings.HasPrefix(lt, "final-recipient:") || strings.HasPrefix(lt, "original-recipient:") {
			if m := emailRe.FindString(t); m != "" {
				add(m)
			}
		} else if strings.HasPrefix(lt, "x-failed-recipients:") {
			for _, m := range emailRe.FindAllString(strings.TrimSpace(t[len("x-failed-recipients:"):]), -1) {
				add(m)
			}
		}
	}
	if len(out) > 0 {
		return out
	}

	// 2. Delivery-failure sentences ("Delivery to X failed", "recipient: X", ...).
	sentPatterns := []*regexp.Regexp{
		regexp.MustCompile(`(?i)delivery to (?:the following recipient )?failed[^:\n]*:?\s*([^\n]+)`),
		regexp.MustCompile(`(?i)(?:recipient|address)[^:\n]*:\s*([^\n]+)`),
		regexp.MustCompile(`(?i)failed recipient[^:\n]*:?\s*([^\n]+)`),
		regexp.MustCompile(`(?i)undelivered (?:mail )?to\s+([^\n]+)`),
	}
	for _, re := range sentPatterns {
		for _, m := range re.FindAllStringSubmatch(body, -1) {
			if len(m) > 1 {
				if em := emailRe.FindString(m[1]); em != "" {
					add(em)
				}
			}
		}
		if len(out) > 0 {
			return out
		}
	}

	// 3. Last resort: every address in the body except ours/daemon's.
	for _, m := range emailRe.FindAllString(body, -1) {
		if strings.ToLower(m) == selfLower || strings.HasPrefix(strings.ToLower(m), "mailer-daemon@") {
			continue
		}
		add(m)
	}
	return out
}

// parseBounceMessage extracts bounces from one raw daemon message.
func parseBounceMessage(raw, self string, uid uint32) []Bounce {
	recipients := extractFailedRecipients(raw, self)
	var out []Bounce
	for _, r := range recipients {
		verdict, reason := ClassifyBounce(raw)
		out = append(out, Bounce{Email: r, Verdict: verdict, Reason: reason, UID: uid})
	}
	return out
}

// openMailbox dials Gmail IMAPS and logs in. Caller must Logout.
func openMailbox() (*client.Client, string, error) {
	password, err := db.LoadAppPassword()
	if err != nil || password == "" {
		return nil, "", fmt.Errorf("Gmail app password not found. Run 'crm store-password' first")
	}
	password = strings.ReplaceAll(password, " ", "")
	password = strings.ReplaceAll(password, "-", "")
	addr := db.GmailAddr

	c, err := client.DialTLS("imap.gmail.com:993", &tls.Config{ServerName: "imap.gmail.com"})
	if err != nil {
		return nil, "", fmt.Errorf("imap dial: %w", err)
	}
	if err := c.Login(addr, password); err != nil {
		c.Logout()
		return nil, "", fmt.Errorf("imap auth: %w (check the app password with 'crm store-password')", err)
	}
	return c, addr, nil
}

// DaemonUIDs returns all Mailer-Daemon message UIDs in INBOX, ascending
// (oldest first). The snapshot is stable for paged full-inbox sweeps.
func DaemonUIDs() ([]uint32, error) {
	c, _, err := openMailbox()
	if err != nil {
		return nil, err
	}
	defer c.Logout()

	mbox, err := c.Select("INBOX", false)
	if err != nil {
		return nil, fmt.Errorf("select INBOX: %w", err)
	}
	if mbox.Messages == 0 {
		return nil, nil
	}

	seenUID := map[uint32]bool{}
	var uids []uint32
	for _, sender := range daemonSenders {
		criteria := imap.NewSearchCriteria()
		criteria.Header.Set("From", sender)
		found, err := c.Search(criteria)
		if err != nil {
			return nil, fmt.Errorf("search: %w", err)
		}
		for _, u := range found {
			if !seenUID[u] {
				seenUID[u] = true
				uids = append(uids, u)
			}
		}
	}
	sortUIDs(uids)
	return uids, nil
}

func sortUIDs(uids []uint32) {
	for i := 1; i < len(uids); i++ {
		for j := i; j > 0 && uids[j] < uids[j-1]; j-- {
			uids[j], uids[j-1] = uids[j-1], uids[j]
		}
	}
}

// FetchBouncesByUIDs fetches exactly the given messages and returns one entry
// per failed recipient (deduplicated by email, strongest verdict wins).
func FetchBouncesByUIDs(uids []uint32) ([]Bounce, error) {
	if len(uids) == 0 {
		return nil, nil
	}
	c, addr, err := openMailbox()
	if err != nil {
		return nil, err
	}
	defer c.Logout()

	if _, err := c.Select("INBOX", false); err != nil {
		return nil, fmt.Errorf("select INBOX: %w", err)
	}

	seqset := new(imap.SeqSet)
	seqset.AddNum(uids...)
	section := &imap.BodySectionName{}
	items := []imap.FetchItem{imap.FetchEnvelope, imap.FetchUid, section.FetchItem()}

	var bounces []Bounce
	messages := make(chan *imap.Message, len(uids))
	done := make(chan error, 1)
	go func() {
		done <- c.Fetch(seqset, items, messages)
	}()

	for msg := range messages {
		if msg == nil {
			continue
		}
		var raw string
		if r := msg.GetBody(section); r != nil {
			b, _ := io.ReadAll(r)
			raw = string(b)
		} else if msg.Envelope != nil {
			raw = msg.Envelope.Subject
		}
		if raw == "" {
			continue
		}
		bounces = append(bounces, parseBounceMessage(raw, addr, msg.Uid)...)
	}
	if err := <-done; err != nil {
		return nil, fmt.Errorf("fetch: %w", err)
	}
	return DedupeBounces(bounces), nil
}

// DedupeBounces collapses entries by email, keeping the strongest verdict
// (invalid > blocked > other), stable in first-seen order.
func DedupeBounces(bounces []Bounce) []Bounce {
	byEmail := map[string]Bounce{}
	order := map[string]int{}
	for _, b := range bounces {
		key := strings.ToLower(strings.TrimSpace(b.Email))
		if key == "" {
			continue
		}
		cur, ok := byEmail[key]
		if !ok {
			byEmail[key] = b
			order[key] = len(order)
			continue
		}
		if rank(b.Verdict) > rank(cur.Verdict) {
			b.UID = cur.UID
			byEmail[key] = b
		}
	}
	out := make([]Bounce, 0, len(byEmail))
	for _, b := range byEmail {
		out = append(out, b)
	}
	for i := range out {
		for j := i + 1; j < len(out); j++ {
			ki := strings.ToLower(out[i].Email)
			kj := strings.ToLower(out[j].Email)
			if order[kj] < order[ki] {
				out[i], out[j] = out[j], out[i]
			}
		}
	}
	return out
}

// FetchBounces logs into Gmail over IMAPS, searches Mailer-Daemon delivery
// failures and returns one entry per failed recipient (limit caps messages,
// newest first).
func FetchBounces(limit int) ([]Bounce, error) {
	uids, err := DaemonUIDs()
	if err != nil {
		return nil, err
	}
	if len(uids) == 0 {
		return nil, nil
	}
	// Newest first.
	for i, j := 0, len(uids)-1; i < j; i, j = i+1, j-1 {
		uids[i], uids[j] = uids[j], uids[i]
	}
	if limit > 0 && len(uids) > limit {
		uids = uids[:limit]
	}
	return FetchBouncesByUIDs(uids)
}

func rank(v BounceVerdict) int {
	switch v {
	case VerdictInvalid:
		return 2
	case VerdictBlocked:
		return 1
	default:
		return 0
	}
}

// ParseBounceText is a testable helper: classify recipients in a raw DSN
// without touching the network.
func ParseBounceText(raw, self string) []Bounce {
	return parseBounceMessage(raw, self, 0)
}

var statusRe = regexp.MustCompile(`(?i)\b([45]\d\d)[- ]([45]\.\d{1,3}\.\d{1,3})`)

// BounceAudit is a per-message verification record used to prove a verdict.
type BounceAudit struct {
	UID              uint32   `json:"uid"`
	Emails           []string `json:"emails"`
	Verdict          string   `json:"verdict"`
	Reason           string   `json:"reason"`
	HasInvalidMarker bool     `json:"has_invalid_marker"`
	HasBlockedMarker bool     `json:"has_blocked_marker"`
	StatusCode       string   `json:"status_code"`
	Snippet          string   `json:"snippet"`
}

// AuditBounces re-fetches Mailer-Daemon messages and returns one audit record
// per message, exposing the raw evidence (status code, marker hits, diagnostic
// snippet) behind each verdict so blocked-vs-invalid can be verified.
func AuditBounces(limit int) ([]BounceAudit, error) {
	password, err := db.LoadAppPassword()
	if err != nil || password == "" {
		return nil, fmt.Errorf("Gmail app password not found. Run 'crm store-password' first")
	}
	password = strings.ReplaceAll(password, " ", "")
	password = strings.ReplaceAll(password, "-", "")
	addr := db.GmailAddr

	c, err := client.DialTLS("imap.gmail.com:993", &tls.Config{ServerName: "imap.gmail.com"})
	if err != nil {
		return nil, fmt.Errorf("imap dial: %w", err)
	}
	defer c.Logout()

	if err := c.Login(addr, password); err != nil {
		return nil, fmt.Errorf("imap auth: %w", err)
	}

	mbox, err := c.Select("INBOX", false)
	if err != nil {
		return nil, fmt.Errorf("select INBOX: %w", err)
	}
	if mbox.Messages == 0 {
		return nil, nil
	}

	var uids []uint32
	for _, sender := range daemonSenders {
		criteria := imap.NewSearchCriteria()
		criteria.Header.Set("From", sender)
		found, err := c.Search(criteria)
		if err != nil {
			return nil, fmt.Errorf("search: %w", err)
		}
		uids = append(uids, found...)
	}
	seenUID := map[uint32]bool{}
	var uniq []uint32
	for i := len(uids) - 1; i >= 0; i-- {
		if !seenUID[uids[i]] {
			seenUID[uids[i]] = true
			uniq = append(uniq, uids[i])
		}
	}
	uids = uniq
	if limit > 0 && len(uids) > limit {
		uids = uids[:limit]
	}
	if len(uids) == 0 {
		return nil, nil
	}

	seqset := new(imap.SeqSet)
	seqset.AddNum(uids...)
	section := &imap.BodySectionName{}
	items := []imap.FetchItem{imap.FetchUid, section.FetchItem()}

	messages := make(chan *imap.Message, len(uids))
	done := make(chan error, 1)
	go func() {
		done <- c.Fetch(seqset, items, messages)
	}()

	var audits []BounceAudit
	for msg := range messages {
		if msg == nil {
			continue
		}
		var raw string
		if r := msg.GetBody(section); r != nil {
			b, _ := io.ReadAll(r)
			raw = string(b)
		}
		if raw == "" {
			continue
		}
		rel := relevantBody(raw)
		lower := strings.ToLower(rel)
		bh := markerHits(lower, blockedMarkers)
		ih := markerHits(lower, invalidMarkers)
		verdict, reason := ClassifyBounce(raw)
		code := ""
		if m := statusRe.FindStringSubmatch(raw); m != nil {
			code = m[1] + "-" + m[2]
		}
		snip := diagnosticSnippet(raw)
		audits = append(audits, BounceAudit{
			UID: msg.Uid, Emails: extractFailedRecipients(raw, addr),
			Verdict: string(verdict), Reason: reason,
			HasInvalidMarker: len(ih) > 0, HasBlockedMarker: len(bh) > 0,
			StatusCode: code, Snippet: snip,
		})
	}
	if err := <-done; err != nil {
		return nil, fmt.Errorf("fetch: %w", err)
	}
	return audits, nil
}

// relevantBody extracts the human-readable (text/plain) and machine
// (message/delivery-status) sections of a bounce, excluding transport
// headers, DKIM/ARC signatures, HTML duplicates, images and the quoted
// original message. Falls back to the full raw text when no MIME structure
// is found.
func relevantBody(raw string) string {
	if !strings.Contains(strings.ToLower(raw), "content-type:") {
		return raw
	}
	var b strings.Builder
	inWanted := false
	for _, line := range strings.Split(raw, "\n") {
		t := strings.TrimSpace(line)
		lt := strings.ToLower(t)
		if strings.HasPrefix(lt, "content-type:") {
			inWanted = strings.Contains(lt, "text/plain") ||
				strings.Contains(lt, "message/delivery-status")
			continue
		}
		if !inWanted {
			continue
		}
		if strings.HasPrefix(t, "--") && len(t) > 2 && !strings.Contains(t, " ") {
			// MIME boundary (no spaces); "-- " signature separators keep content.
			inWanted = false
			continue
		}
		b.WriteString(line + "\n")
	}
	if out := strings.TrimSpace(b.String()); out != "" {
		return out
	}
	return raw
}

// diagnosticSnippet returns the most telling DSN line (Diagnostic-Code,
// Status, or Action line), truncated for display.
func diagnosticSnippet(raw string) string {
	var fallback string
	for _, line := range strings.Split(raw, "\n") {
		t := strings.TrimSpace(line)
		lt := strings.ToLower(t)
		if strings.HasPrefix(lt, "diagnostic-code:") {
			return trunc(t, 220)
		}
		if strings.HasPrefix(lt, "status:") && fallback == "" {
			fallback = t
		}
		if strings.HasPrefix(lt, "action:") && fallback == "" {
			fallback = t
		}
	}
	if fallback != "" {
		return trunc(fallback, 220)
	}
	// Otherwise first long line mentioning a marker.
	for _, line := range strings.Split(raw, "\n") {
		t := strings.TrimSpace(line)
		if len(t) > 40 {
			return trunc(t, 220)
		}
	}
	return ""
}

func trunc(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n] + "…"
}

// senderOf parses the From header of a raw message (used to skip non-daemon mail).
func senderOf(raw string) string {
	m, err := mail.ReadMessage(strings.NewReader(raw))
	if err != nil {
		return ""
	}
	from := m.Header.Get("From")
	addr, err := mail.ParseAddress(from)
	if err != nil {
		return from
	}
	return addr.Address
}

var _ = senderOf
