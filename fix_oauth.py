lines = open('pages.js', encoding='utf-8').readlines()
lines[5100:5109] = [
    "    sessionStorage.setItem('_sgn_provider', provider);\n",
    "    window._sb.auth.signInWithOAuth({\n",
    "      provider: provider,\n",
    "      options: { redirectTo: window.location.origin + '/' }\n",
    "    });\n",
]
open('pages.js', 'w', encoding='utf-8').writelines(lines)
print('완료')
