package main

import (
	"encoding/csv"
	"flag"
	"fmt"
	"os"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"unicode/utf8"
)

const outputFile = "emails.csv"

// maxOutputLines is the default cap on total CSV lines (header included) when
// -trim is used without an explicit count.
const maxOutputLines = 2000

// lineLimit implements the -trim flag: bare -trim caps the output at
// maxOutputLines lines, while -trim=1000 (or any positive count) caps it at
// that many lines.
type lineLimit struct {
	enabled bool
	limit   int
}

func newLineLimit() *lineLimit { return &lineLimit{limit: maxOutputLines} }

func (l *lineLimit) IsBoolFlag() bool { return true }

func (l *lineLimit) Set(s string) error {
	switch strings.ToLower(s) {
	case "true", "1", "t":
		l.enabled = true
		l.limit = maxOutputLines
		return nil
	case "false", "0", "f":
		l.enabled = false
		return nil
	}
	n, err := strconv.Atoi(s)
	if err != nil || n <= 0 {
		return fmt.Errorf("invalid -trim value %q (use -trim, -trim=false or -trim=<lines>)", s)
	}
	l.enabled = true
	l.limit = n
	return nil
}

func (l *lineLimit) String() string { return strconv.Itoa(l.limit) }

var trimFlag = newLineLimit()
var headerFlag = flag.Bool("header", false, "write a header row (\"email\") to the CSV")

func init() {
	flag.Var(trimFlag, "trim", "limit the output CSV to 2000 lines (or -trim=1000 for a custom count)")
}

// emailRegex matches common email addresses (ASCII subset, safe on UTF-8 data).
// Word boundaries ensure the match starts/ends on a word character, so leading
// dots or trailing punctuation are not captured.
var emailRegex = regexp.MustCompile(`\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}\b`)

// validTLD reports whether the final label of an email is a plausible real TLD.
// All 2-3 letter labels are accepted (ccTLDs + classic gTLDs); longer labels
// must appear in knownLongTLDs. This rejects fake long "TLDs" such as .mena.
func validTLD(email string) bool {
	dot := strings.LastIndex(email, ".")
	if dot < 0 {
		return false
	}
	tld := email[dot+1:]
	if len(tld) <= 3 {
		return true
	}
	_, ok := knownLongTLDs[tld]
	return ok
}

// knownLongTLDs is a whitelist of common real TLDs that are 4+ characters.
var knownLongTLDs = map[string]struct{}{
	"academy": {}, "accountants": {}, "actor": {}, "agency": {}, "airforce": {},
	"africa": {}, "apartments": {}, "app": {}, "archi": {}, "army": {}, "art": {},
	"asia": {},
	"associates": {}, "attorney": {}, "auction": {}, "audio": {}, "author": {},
	"auto": {}, "autos": {}, "band": {}, "bank": {}, "bargains": {}, "beer": {},
	"best": {}, "bid": {}, "bike": {}, "bingo": {}, "bio": {}, "black": {},
	"blog": {}, "blue": {}, "boo": {}, "boutique": {}, "broker": {}, "build": {},
	"builders": {}, "business": {}, "buzz": {}, "cab": {}, "cafe": {}, "cam": {},
	"camp": {}, "capital": {}, "cards": {}, "care": {}, "career": {}, "careers": {},
	"cars": {}, "casa": {}, "cash": {}, "casino": {}, "catering": {}, "center": {},
	"ceo": {}, "cfd": {}, "chat": {}, "cheap": {}, "christmas": {}, "church": {},
	"city": {}, "claims": {}, "cleaning": {}, "click": {}, "clinic": {}, "clothing": {},
	"cloud": {}, "club": {}, "coach": {}, "codes": {}, "coffee": {}, "college": {},
	"community": {}, "company": {}, "computer": {}, "condos": {}, "construction": {},
	"consulting": {}, "contact": {}, "contractors": {}, "cooking": {}, "cool": {},
	"coop": {}, "country": {}, "coupons": {}, "courses": {}, "cpa": {}, "credit": {},
	"creditcard": {}, "cruises": {}, "cymru": {}, "dance": {}, "date": {}, "dating": {},
	"day": {}, "deals": {}, "degree": {}, "delivery": {}, "democrat": {}, "dental": {},
	"dentist": {}, "design": {}, "dev": {}, "diamonds": {}, "diet": {}, "digital": {},
	"direct": {}, "directory": {}, "discount": {}, "doctor": {}, "dog": {}, "domains": {},
	"dot": {}, "download": {}, "earth": {}, "education": {}, "email": {}, "energy": {},
	"engineer": {}, "engineering": {}, "enterprises": {}, "equipment": {}, "esq": {},
	"estate": {}, "events": {}, "exchange": {}, "expert": {}, "exposed": {}, "express": {},
	"fail": {}, "faith": {}, "family": {}, "fans": {}, "farm": {}, "fashion": {},
	"feedback": {}, "film": {}, "finance": {}, "financial": {}, "fish": {}, "fishing": {},
	"fit": {}, "fitness": {}, "flights": {}, "florist": {}, "flowers": {}, "fly": {},
	"foo": {}, "football": {}, "forex": {}, "forsale": {}, "forum": {}, "foundation": {},
	"fun": {}, "fund": {}, "furniture": {}, "futbol": {}, "fyi": {}, "gallery": {},
	"game": {}, "games": {}, "garden": {}, "gift": {}, "gifts": {}, "gives": {},
	"glass": {}, "global": {}, "gmbh": {}, "gold": {}, "golf": {}, "graphics": {},
	"gratis": {}, "green": {}, "gripe": {}, "group": {}, "guide": {}, "guitars": {},
	"guru": {}, "haus": {}, "health": {}, "healthcare": {}, "help": {}, "here": {},
	"hiphop": {}, "hockey": {}, "holdings": {}, "holiday": {}, "homes": {}, "horse": {},
	"hospital": {}, "host": {}, "hosting": {}, "house": {}, "how": {}, "immo": {},
	"immobilien": {}, "inc": {}, "industries": {}, "info": {}, "ink": {}, "institute": {},
	"insure": {}, "international": {}, "investments": {}, "irish": {}, "jetzt": {},
	"jewelry": {}, "juegos": {}, "kaufen": {}, "kim": {}, "kitchen": {}, "kiwi": {},
	"land": {}, "law": {}, "lawyer": {}, "lease": {}, "legal": {}, "lgbt": {}, "life": {},
	"lighting": {}, "limited": {}, "limo": {}, "link": {}, "live": {}, "llc": {},
	"loan": {}, "loans": {}, "lol": {}, "london": {}, "love": {}, "ltd": {}, "luxury": {},
	"mail": {}, "management": {}, "manager": {}, "market": {}, "marketing": {},
	"markets": {}, "mba": {}, "media": {}, "meet": {}, "melbourne": {}, "meme": {},
	"memorial": {}, "men": {}, "menu": {}, "miami": {}, "mobi": {}, "moda": {},
	"moe": {}, "mom": {}, "money": {}, "monster": {}, "mortgage": {}, "movie": {},
	"museum": {}, "music": {}, "name": {}, "navy": {}, "network": {}, "new": {},
	"news": {}, "next": {}, "ninja": {}, "now": {}, "observer": {}, "okinawa": {},
	"one": {}, "online": {}, "ooo": {}, "organic": {}, "page": {}, "partners": {},
	"parts": {}, "party": {}, "pet": {}, "pharmacy": {}, "photo": {}, "photography": {},
	"photos": {}, "physio": {}, "pics": {}, "pictures": {}, "pink": {}, "pizza": {},
	"place": {}, "plumbing": {}, "plus": {}, "poker": {}, "porn": {}, "press": {},
	"productions": {}, "promo": {}, "properties": {}, "property": {}, "protection": {},
	"pub": {}, "punk": {}, "purchase": {}, "qpon": {}, "racing": {}, "radio": {},
	"read": {}, "realestate": {}, "realtor": {}, "recipes": {}, "red": {}, "rehab": {},
	"reise": {}, "reisen": {}, "rent": {}, "rentals": {}, "repair": {}, "report": {},
	"republican": {}, "rest": {}, "restaurant": {}, "review": {}, "reviews": {}, "rich": {},
	"rio": {}, "rocks": {}, "rodeo": {}, "room": {}, "rsvp": {}, "rugby": {}, "run": {},
	"sale": {}, "salon": {}, "sarl": {}, "school": {}, "schule": {}, "science": {},
	"scot": {}, "security": {}, "services": {}, "sex": {}, "sexy": {}, "shiksha": {},
	"shoes": {}, "shop": {}, "shopping": {}, "show": {}, "singles": {}, "site": {},
	"ski": {}, "sky": {}, "soccer": {}, "social": {}, "software": {}, "solar": {},
	"solutions": {}, "soy": {}, "space": {}, "sport": {}, "sports": {}, "storage": {},
	"store": {}, "stream": {}, "studio": {}, "study": {}, "style": {}, "sucks": {},
	"supplies": {}, "supply": {}, "support": {}, "surf": {}, "surgery": {}, "sushi": {},
	"systems": {}, "tattoo": {}, "tax": {}, "taxi": {}, "team": {}, "tech": {},
	"technology": {}, "tennis": {}, "theater": {}, "theatre": {}, "tienda": {}, "tips": {},
	"tires": {}, "today": {}, "tokyo": {}, "tools": {}, "top": {}, "tours": {}, "town": {},
	"toys": {}, "trade": {}, "trading": {}, "training": {}, "travel": {}, "trust": {},
	"tube": {}, "university": {}, "vacations": {}, "vanguard": {}, "vegas": {}, "ventures": {},
	"vet": {}, "viajes": {}, "video": {}, "villas": {}, "vin": {}, "vip": {}, "vision": {},
	"vodka": {}, "vote": {}, "voting": {}, "voto": {}, "voyage": {}, "wang": {}, "watch": {},
	"webcam": {}, "website": {}, "wedding": {}, "wiki": {}, "win": {}, "wine": {}, "work": {},
	"works": {}, "world": {}, "wtf": {}, "xin": {}, "xyz": {}, "yoga": {}, "zone": {},
}

func main() {
	flag.Parse()
	if flag.NArg() > 0 {
		fmt.Fprintf(os.Stderr, "unexpected argument: %q (this script takes no positional arguments; use -trim=<lines>)\n", flag.Arg(0))
		flag.Usage()
		os.Exit(2)
	}

	entries, err := os.ReadDir(".")
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to read directory: %v\n", err)
		os.Exit(1)
	}

	// seen maps lowercase email -> original form (case-insensitive dedup).
	seen := make(map[string]string)
	invalid := make(map[string]struct{})

	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		name := entry.Name()
		if name == outputFile {
			continue
		}

		data, err := os.ReadFile(name)
		if err != nil {
			fmt.Fprintf(os.Stderr, "skipping %s: %v\n", name, err)
			continue
		}
		if !utf8.Valid(data) {
			fmt.Printf("skipping %s (not valid UTF-8, likely binary)\n", name)
			continue
		}

		// Read the file as UTF-8 text and pull out every email.
		text := string(data)
		for _, m := range emailRegex.FindAllString(text, -1) {
			key := strings.ToLower(m)
			if _, ok := seen[key]; ok {
				continue
			}
			if !validTLD(key) {
				invalid[key] = struct{}{}
				continue
			}
			seen[key] = m
		}
	}

	emails := make([]string, 0, len(seen))
	for _, v := range seen {
		emails = append(emails, v)
	}
	sort.Slice(emails, func(i, j int) bool {
		return strings.ToLower(emails[i]) < strings.ToLower(emails[j])
	})

	f, err := os.Create(outputFile)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to create %s: %v\n", outputFile, err)
		os.Exit(1)
	}
	defer f.Close()

	w := csv.NewWriter(f)
	linesWritten := 0
	if *headerFlag {
		if err := w.Write([]string{"email"}); err != nil {
			fmt.Fprintf(os.Stderr, "write error: %v\n", err)
			os.Exit(1)
		}
		linesWritten = 1
	}
	emailsWritten := 0
	wasTrimmed := false
	for _, e := range emails {
		if trimFlag.enabled && linesWritten >= trimFlag.limit {
			wasTrimmed = true
			break
		}
		if err := w.Write([]string{e}); err != nil {
			fmt.Fprintf(os.Stderr, "write error: %v\n", err)
			os.Exit(1)
		}
		linesWritten++
		emailsWritten++
	}
	w.Flush()
	if err := w.Error(); err != nil {
		fmt.Fprintf(os.Stderr, "write error: %v\n", err)
		os.Exit(1)
	}

	if len(invalid) > 0 {
		fmt.Printf("skipped %d invalid email(s)\n", len(invalid))
	}
	if trimFlag.enabled && wasTrimmed {
		fmt.Printf("done: %d unique emails found, trimmed to %d lines (%d emails) -> %s\n", len(emails), trimFlag.limit, emailsWritten, outputFile)
	} else {
		fmt.Printf("done: found %d unique emails -> %s\n", len(emails), outputFile)
	}
}
