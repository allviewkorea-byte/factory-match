lines = open('pages.js', encoding='utf-8').readlines()
# 5108번 줄 다음에 pwStrength 내용 추가
lines[5108:5108] = [
    "    if (!password) return 0;\n",
    "    let s = 0;\n",
    "    if (password.length >= 8) s++;\n",
    "    if (/[A-Z]/.test(password) || /[a-z]/.test(password)) s++;\n",
    "    if (/[0-9]/.test(password)) s++;\n",
    "    if (/[^A-Za-z0-9]/.test(password)) s++;\n",
    "    return s;\n",
    "  })();\n",
]
open('pages.js', 'w', encoding='utf-8').writelines(lines)
print('완료')
