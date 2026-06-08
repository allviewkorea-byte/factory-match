lines = open('pages.js', encoding='utf-8').readlines()

for i, line in enumerate(lines):
    if '<span className="hdr-avatar">{localStorage' in line:
        lines[i] = '                <span className="hdr-avatar">{displayInitial}</span>\n'
    elif '<span className="hdr-user-name">{localStorage' in line:
        lines[i] = '                <span className="hdr-user-name">{displayName}{!isAdmin && profile?.role ? \' · \' + (profile.role === \'buyer\' ? \'Buyer\' : \'Manufacturer\') : \'\'}</span>\n'
    elif '<span className="hdr-user-org">{localStorage' in line:
        lines[i] = '                <span className="hdr-user-org">{displayOrg}</span>\n'

open('pages.js', 'w', encoding='utf-8').writelines(lines)
print('완료')
