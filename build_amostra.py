import re, markdown
md=open('/home/user/workspace/edicao-amostra-hotel.md').read()
body=md.split('\n',1)[1]
body=body[body.index('## A janela'):].split('\n',1)[1]
h=markdown.markdown(body,extensions=['tables','md_in_html'],tab_length=2)
svg=open('/home/user/workspace/site/fluxo.svg.html').read()
h=h.replace('<!--FLUXO-->',svg)
h=re.sub(r'<blockquote>\n<p><strong>Código','<blockquote class="lei">\n<p><strong>Código',h)
h=h.replace('<blockquote>\n<p>A meu ver, hoje','<blockquote class="conclusao">\n<p>A meu ver, hoje')
def prog(m):
    n=int(m.group(1))
    dots=''.join(f'<span class="{"done" if i<n else "on" if i==n else ""}">{i}</span>' for i in range(1,7))
    return f'<div class="prog" aria-label="Pergunta {n} de 6">{dots}</div>\n<h3>{n}.'
h=re.sub(r'<h3>(\d)\.',prog,h)
for t,c in [('Fato registrado','f'),('Relato','r'),('Inferência','i'),('Opinião','o')]:
    h=h.replace(f'<h4>{t}</h4>',f'<h4 class="etq"><span class="lb {c}">{t}</span></h4>')
h=h.replace('<h3>Teste rápido</h3>','<div class="teste"><h3>Teste rápido</h3>').replace('A resposta está logo abaixo.</p>','A resposta está logo abaixo.</p></div>')
h=h.replace('<h3>Na mesa do almoço</h3>','<div class="almoco"><h3>Na mesa do almoço</h3>')
h=h.replace('</blockquote>\n<hr />\n<div class="rodape">','</blockquote></div>\n<div class="rodape">')
f='/home/user/workspace/site/amostra.html'; page=open(f).read()
a=page.index('<main class="wrap narrow article">')+len('<main class="wrap narrow article">'); b=page.index('</main>')
h=h.replace('</p></div>\n<hr />\n<div class="almoco">','</p></div>\n<div class="almoco">')
open(f,'w').write(page[:a]+'\n'+h+'\n'+page[b:])
