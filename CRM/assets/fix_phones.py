import re

input_file = 'contacts.csv'
output_file = 'contacts_fixed.csv'

with open(input_file, 'r', encoding='utf-8-sig') as f:
    lines = f.read().splitlines()

header = lines[0]
phone_col = header.split(',').index('UserPhone')

fixed = 0
new_lines = []
for line in lines:
    if not line.strip():
        continue
    parts = line.split(',')
    if len(parts) > phone_col:
        phone = parts[phone_col].strip().strip('"')
        if phone and not phone.startswith('+') and phone != '0' and re.match(r'^\d+$', phone):
            parts[phone_col] = f'="+{phone}"'
            fixed += 1
    new_lines.append(','.join(parts))

with open(output_file, 'w', encoding='utf-8-sig', newline='') as f:
    f.write('\n'.join(new_lines))

print(f'Done. Fixed {fixed} phone numbers. Saved to {output_file}')
