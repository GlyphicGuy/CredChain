import os
import re

replacements = {
    r'\bconsensus\b': 'Verified',
    r'\bConsensus\b': 'Verified',
    r'\bcryptographic\b': 'Protected',
    r'\bCryptographic\b': 'Protected',
    r'\bcryptographically\b': 'securely',
    r'\banchored\b': 'Issued',
    r'\bAnchored\b': 'Issued',
    r'\bAnchoring\b': 'Issuing',
    r'\bnetwork\b': 'trusted system',
    r'\bNetwork\b': 'Trusted System',
}

files_to_check = [
    "src/app/(portals)/verify/page.tsx",
    "src/app/(portals)/admin/page.tsx",
    "src/app/(portals)/wallet/page.tsx",
    "src/app/(portals)/issuer/records/page.tsx",
    "src/app/(portals)/issuer/issue/page.tsx",
    "src/app/(portals)/issuer/layout.tsx",
    "src/app/(portals)/issuer/page.tsx",
    "src/app/layout.tsx",
    "src/app/(public)/page.tsx",
    "src/app/login/page.tsx"
]

def safe_replace(match):
    # If the word is part of an import, variable name or URL, don't replace
    # We will just do a simple replace but check for imports manually.
    pass

for file in files_to_check:
    with open(file, 'r') as f:
        content = f.read()
    
    # We will apply replacements but skip lines that contain 'import' or 'href' or 'http'
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        if 'import' in line or 'http' in line or 'href' in line or 'className' in line and 'lucide' not in line:
            # wait, className often has standard tailwind, we should still replace text inside tags.
            # a safer way: we will manually replace in Python, just avoiding 'lucide-react' and 'credchain.network'
            pass

        # simple replace, but avoid 'Network' if it's a component <Network
        # avoid '.network'
        new_line = line
        if 'lucide-react' not in line and '.network' not in line and '<Network' not in line and 'Network ' not in line and 'Network,' not in line:
            new_line = new_line.replace('consensus', 'Verified').replace('Consensus', 'Verified')
            new_line = new_line.replace('cryptographically', 'securely')
            new_line = new_line.replace('cryptographic', 'Protected').replace('Cryptographic', 'Protected')
            new_line = new_line.replace('anchored', 'issued').replace('Anchored', 'Issued')
            new_line = new_line.replace('Anchoring', 'Issuing')
            new_line = new_line.replace(' against the network', ' against the trusted system')
            new_line = new_line.replace(' on the network', ' on the trusted system')
            new_line = new_line.replace(' network.', ' trusted system.')
            new_line = new_line.replace(' network ', ' trusted system ')
            new_line = new_line.replace('Network Records', 'Verified Records')
            new_line = new_line.replace('Network Admin', 'System Admin')
            new_line = new_line.replace('Network Synced', 'System Synced')
            new_line = new_line.replace('Network Status', 'System Status')
        new_lines.append(new_line)

    with open(file, 'w') as f:
        f.write('\n'.join(new_lines))

print("Replacements done.")
