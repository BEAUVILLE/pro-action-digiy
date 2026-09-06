from pathlib import Path
import re
import subprocess

path = Path('index.html')
s = path.read_text(encoding='utf-8')


def once(old, new, label):
    global s
    n = s.count(old)
    if n != 1:
        raise SystemExit(f'{label}: expected 1 occurrence, found {n}')
    s = s.replace(old, new, 1)


once('<meta name="digiy-lang" content="fr-en-es-de-it-nl-ar-20260731"/>','<meta name="digiy-lang" content="fr-en-es-pt-de-it-nl-ar-20260906"/>','meta digiy-lang')
once('<!-- DIGIY ACTION PRO 7 LANGUES MONOFICHIER -->','<!-- DIGIY ACTION PRO 8 LANGUES MONOFICHIER -->','comment 8 languages')
once('/* DIGIY LANGUAGE PASSPORT 7L v1 */','/* DIGIY LANGUAGE PASSPORT 8L v1 */','passport comment')
once('const LANGS=["fr","en","es","de","it","nl","ar"];','const LANGS=["fr","en","es","pt","de","it","nl","ar"];','LANGS')
once('const LOCALE={fr:"fr-FR",en:"en-US",es:"es-ES",de:"de-DE",it:"it-IT",nl:"nl-NL",ar:"ar-SA"};','const LOCALE={fr:"fr-FR",en:"en-US",es:"es-ES",pt:"pt-PT",de:"de-DE",it:"it-IT",nl:"nl-NL",ar:"ar-SA"};','LOCALE')
once('const labels={fr:"🇫🇷 FR",en:"🇬🇧 EN",es:"🇪🇸 ES",de:"🇩🇪 DE",it:"🇮🇹 IT",nl:"🇳🇱 NL",ar:"🌙 AR"};','const labels={fr:"🇫🇷 FR",en:"🇬🇧 EN",es:"🇪🇸 ES",pt:"🇵🇹 PT",de:"🇩🇪 DE",it:"🇮🇹 IT",nl:"🇳🇱 NL",ar:"🌙 AR"};','labels')

pt_ui = '  UI.pt={title:"A Voz do Negócio — DIGIYLYFE",desc:"A Voz do Negócio DIGIYLYFE — pedido simples, fichas diretas e contacto direto.",logo:"EU OUÇO",label:"Fala aqui ou escreve o que precisas",ask:"Pedido por voz ou escrito",placeholder:"GO",examples:"🟥 EXEMPLOS PARA FALAR",see:"VER",clear:"APAGAR",correction:"✏️ Corrigir o meu pedido",consigne:"🎧 Guia",consigneLine:"📱 Precisas de ajuda? Carrega em <b>GO</b> e fala. Depois toca em <b>VER</b> — a DIGIY entende e as fichas aparecem.",resultTitle:"Fichas disponíveis",resultIntro:"Os resultados aparecem diretamente após o pedido.",empty:"Ainda não existe uma ficha exata.",footer:"A Voz do Negócio — DIGIYLYFE",audio:"Bem-vindo à Voz do Negócio DIGIY. Carrega em GO para falar naturalmente ou escolhe um ícone rápido. Depois toca em VER. A DIGIY entende a necessidade e mostra as fichas úteis.",guide:"Guia do telefone. Carrega em GO e fala. Depois toca em VER. A DIGIY entende e as fichas aparecem.",reply:"Entendi o teu pedido. As fichas úteis estão prontas. A DIGIY prepara e o terreno mantém o controlo."};\n\n'
once('  const QUICK={', pt_ui + '  const QUICK={', 'insert UI.pt')

pt_quick = '  QUICK.pt=["Quero dizer à DIGIY o que procuro","Quero descobrir endereços em Sarlat","Quero uma ideia de passeio na Petite Côte","Procuro um motorista para o AIBD amanhã de manhã","Quero ver os motoristas disponíveis","Procuro um quarto este fim de semana em Saly","Quero reservar uma mesa esta noite","Preciso de um artesão para uma reparação","Quero ver os comércios locais","Procuro um produto numa loja","Procuro um emprego ou uma missão","Quero publicar um anúncio na rede","Quero enviar um comprovativo de pagamento Wave","Quero ir até à DIGIY ou encontrar o caminho","Procuro alojamento com opção solidária","Quero ouvir a visão DIGIYLYFE","Quero ser orientado pelo assistente DIGIY"];\n\n'
once('  const EXAMPLES={', pt_quick + '  const EXAMPLES={', 'insert QUICK.pt')

pt_examples = '  EXAMPLES.pt=["Procuro um canalizador em Saly","Procuro um pedreiro em Saly","Procuro um eletricista em Saly","Procuro um serviço de energia solar em Dakar","Procuro toalhas em Saly","Procuro um apartamento em Saly para 4 pessoas","Procuro um motorista para o AIBD","Quero uma ideia de passeio na Petite Côte","Quero reservar uma mesa esta noite","Procuro um restaurante em Sarlat","Procuro um quarto em Sarlat","Quero enviar um comprovativo de pagamento Wave"];\n\n'
once('  const META={', pt_examples + '  const META={', 'insert EXAMPLES.pt')

pt_meta = '  META.pt={"Fiche officielle":"Ficha oficial","Fiche publique":"Ficha pública","Partenaire qualifié":"Parceiro qualificado","Référencé public":"Ficha pública","Secteur à préciser":"Zona a confirmar","Catégorie":"Categoria","Secteur":"Zona","FICHE":"FICHA","APPELER":"LIGAR","OUVRIR":"ABRIR"};\n\n'
once('  const RULES=[', pt_meta + '  const RULES=[', 'insert META.pt')

pt_rules = '''  RULES.push(
    [/canalizador|encanador|canalizacao|canalização/," plombier plomberie fuite robinet wc sanitaire"],
    [/pedreiro|alvenaria/," macon maçon maçonnerie batisseur bâtisseur construction"],
    [/eletricista|electricista|eletricidade/," electricien électricien electricite électricité courant"],
    [/energia solar|painel solar|paineis solares|painéis solares/," solaire panneau panneaux batterie energie régulateur"],
    [/motorista|condutor|aeroporto/," chauffeur driver taxi aibd trajet transfert voiture"],
    [/quarto|alojamento|apartamento|hospedagem/," chambre appartement logement location villa dormir nuit hébergement hôtel"],
    [/restaurante|jantar|almoco|almoço|mesa/," réserver reservation table restaurant manger diner"],
    [/reservar|reserva/," réserver reservation"],
    [/loja|produto|comprar|toalha|toalhas|lencol|lençol|roupao|roupão/," boutique market produit acheter serviette serviettes drap draps peignoir linge commerce"],
    [/emprego|trabalho|missao|missão/," emploi travail job mission recrute postuler"],
    [/passeio|descobrir|atividade/," sortie visite découvrir idée activité explore petite cote"],
    [/dinheiro|comprovativo/," paiement pay argent wave preuve reçu"],
    [/endereco|endereço|caminho|mapa/," adresse route venir carte localisation"],
    [/anuncio|anúncio|rede|publicar/," annonce réseau publier visibilité"],
    [/ouvir|escutar/," audio écouter vision"],
    [/ajuda|guia/," assistant aide guide"]
  );

'''
once('  function safe(value){', pt_rules + '  function safe(value){', 'insert Portuguese lexical rules')

path.write_text(s, encoding='utf-8')

for check in [
    'fr-en-es-pt-de-it-nl-ar-20260906',
    'const LANGS=["fr","en","es","pt","de","it","nl","ar"]',
    'pt:"pt-PT"',
    'pt:"🇵🇹 PT"',
    'UI.pt=',
    'QUICK.pt=',
    'EXAMPLES.pt=',
    'META.pt=',
    'canalizador',
    'motorista',
]:
    if check not in s:
        raise SystemExit(f'missing check: {check}')

m = re.search(r'<script id="digiy-action-7lang-runtime">([\s\S]*?)</script>', s)
if not m:
    raise SystemExit('language runtime script not found')
js = Path('/tmp/action-pro-lang-runtime.js')
js.write_text(m.group(1), encoding='utf-8')
subprocess.run(['node', '--check', str(js)], check=True)
print('ACTION PRO PT patch OK')
