lines = open('pages.js', encoding='utf-8').readlines()
lines[5105:5105] = [
    "  };\n",
    "\n",
    "  const pwStrength = (() => {\n",
]
# 중복된 pwStrength 제거 (5108~5111이 중복됨)
del lines[5108:5115]
open('pages.js', 'w', encoding='utf-8').writelines(lines)
print('완료')
