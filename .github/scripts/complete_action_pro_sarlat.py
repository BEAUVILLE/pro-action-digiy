from pathlib import Path
import re

index_path = Path("index.html")
directory_path = Path("annuaire-public-digiy.js")
index = index_path.read_text(encoding="utf-8")
directory = directory_path.read_text(encoding="utf-8")

if 'action-pro-sarlat-territoire-20260725-v1' in index:
    raise SystemExit('SARLAT est déjà intégré dans ACTION PRO')

index = re.sub(
    r'<meta name="digiy-build" content="[^"]+"/>',
    '<meta name="digiy-build" content="action-pro-sarlat-territoire-20260725-v1"/>',
    index,
    count=1,
)
index = re.sub(
    r'<script src="\./annuaire-public-digiy\.js\?v=[^"]+"></script>',
    '<script src="./annuaire-public-digiy.js?v=20260725-sarlat-v1"></script>',
    index,
    count=1,
)

quick_anchor = '        <button class="chip" type="button" data-q="Je veux une idée de sortie sur la Petite Côte" aria-label="EXPLORE">🗺️</button>'
quick_sarlat = '        <button class="chip" type="button" data-q="Je veux découvrir les adresses de Sarlat" aria-label="SARLAT">🏰</button>\n' + quick_anchor
if quick_anchor not in index:
    raise SystemExit('Ancre bouton rapide introuvable')
index = index.replace(quick_anchor, quick_sarlat, 1)

example_anchor = '        <button class="examplePhrase" type="button" data-q="Je veux envoyer une preuve Wave"><span class="mod">💳 DIGIY CARNET</span><span class="fr">Je veux envoyer une preuve Wave</span><span class="wo">Damaa bëgg yónnee preuve Wave.</span></button>'
example_sarlat = '''        <button class="examplePhrase" type="button" data-q="Je cherche un restaurant à Sarlat"><span class="mod">🍽️ MANGER À SARLAT</span><span class="fr">Je cherche un restaurant à Sarlat</span><span class="wo">Damaa wut restaurant ci Sarlat.</span></button>
        <button class="examplePhrase" type="button" data-q="Je cherche une chambre à Sarlat"><span class="mod">🛏️ DORMIR À SARLAT</span><span class="fr">Je cherche une chambre à Sarlat</span><span class="wo">Damaa wut chambre ci Sarlat.</span></button>
''' + example_anchor
if example_anchor not in index:
    raise SystemExit('Ancre exemples introuvable')
index = index.replace(example_anchor, example_sarlat, 1)

data_anchor = '    {keys:["sortie","pêche","peche","explore","visite","activité","activite","découvrir","decouvrir","idée","idee","territoire","petite cote","petite côte","genn","génn"], icon:"🗺️", title:"EXPLORE", url:"https://explore.digiylyfe.com/", wa:"Bonjour, je cherche une sortie ou une idée de découverte via DIGIY."},'
data_sarlat = '''    {keys:["sarlat","sarlat la caneda","sarlat-la-caneda","périgord noir","perigord noir","dordogne","territoire sarlat","adresses sarlat"], icon:"🏰", title:"SARLAT", url:"https://digiylyfe.com/sarlat.html", wa:"Bonjour, je souhaite découvrir les adresses DIGIYLYFE de Sarlat."},
    {keys:["manger à sarlat","manger a sarlat","restaurant à sarlat","restaurant a sarlat","restaurants sarlat","table sarlat","dîner sarlat","diner sarlat"], icon:"🍽️", title:"MANGER À SARLAT", url:"https://digiylyfe.com/sarlat.html#manger", wa:"Bonjour, je cherche où manger à Sarlat via DIGIYLYFE."},
    {keys:["dormir à sarlat","dormir a sarlat","chambre à sarlat","chambre a sarlat","hébergement sarlat","hebergement sarlat","logement sarlat","nuit sarlat"], icon:"🛏️", title:"DORMIR À SARLAT", url:"https://digiylyfe.com/sarlat.html#dormir", wa:"Bonjour, je cherche où dormir à Sarlat via DIGIYLYFE."},
''' + data_anchor
if data_anchor not in index:
    raise SystemExit('Ancre DATA introuvable')
index = index.replace(data_anchor, data_sarlat, 1)

sector_anchor = '    {label:"Petite Côte", keys:["petite cote","petite côte"]}'
sector_sarlat = '    {label:"Sarlat", keys:["sarlat","sarlat la caneda","sarlat-la-caneda","perigord noir","périgord noir","dordogne"]},\n' + sector_anchor
if sector_anchor not in index:
    raise SystemExit('Ancre SECTEURS introuvable')
index = index.replace(sector_anchor, sector_sarlat, 1)

fiche_anchor = '''      wa:"Bonjour Lamine, je viens de DIGIYLYFE pour un besoin de transport."
    }
  ];'''
fiches_sarlat = '''      wa:"Bonjour Lamine, je viens de DIGIYLYFE pour un besoin de transport."
    },
    {
      id:"sarlat-entre-2",
      kind:"directory",
      public:true,
      priority:110,
      priorite:110,
      icon:"🍕",
      title:"L’Entre 2 — Restaurant à Sarlat",
      titre:"L’Entre 2 — Restaurant à Sarlat",
      nom:"L’Entre 2",
      metier:"restaurant",
      activite:"Brasserie · Pizzeria · Terrasse",
      categorie:"RESA",
      sousCategorie:"restaurant",
      secteur:"Sarlat",
      zones:["Sarlat","Périgord Noir","Dordogne"],
      statut:"fiche_officielle",
      labelStatut:"Fiche restaurant directe DIGIYLYFE",
      phone:"33673274427",
      whatsapp:"",
      keys:["l entre 2","l’entre 2","entre 2","restaurant","resto","brasserie","pizzeria","pizza","terrasse","manger à sarlat","manger a sarlat","restaurant à sarlat","restaurant a sarlat","table à sarlat","table a sarlat"],
      mots:["l entre 2","l’entre 2","entre 2","restaurant","resto","brasserie","pizzeria","pizza","terrasse","manger à sarlat","manger a sarlat","restaurant à sarlat","restaurant a sarlat","table à sarlat","table a sarlat"],
      description:"L’Entre 2 à Sarlat : brasserie, pizzeria et terrasse. Carte, photos et contact direct.",
      url:"https://malraux-entre2.digiylyfe.com/",
      wa:"Bonjour L’Entre 2, je viens de DIGIYLYFE pour une demande à Sarlat."
    },
    {
      id:"sarlat-le-malraux",
      kind:"directory",
      public:true,
      priority:109,
      priorite:109,
      icon:"🍷",
      title:"Le Malraux — Restaurant à Sarlat",
      titre:"Le Malraux — Restaurant à Sarlat",
      nom:"Le Malraux",
      metier:"restaurant",
      activite:"Cuisine périgourdine · Salle chaleureuse",
      categorie:"RESA",
      sousCategorie:"restaurant",
      secteur:"Sarlat",
      zones:["Sarlat","Périgord Noir","Dordogne"],
      statut:"fiche_officielle",
      labelStatut:"Fiche restaurant directe DIGIYLYFE",
      phone:"33642160657",
      whatsapp:"",
      keys:["le malraux","malraux","restaurant","resto","cuisine périgourdine","cuisine perigourdine","gastronomie","manger à sarlat","manger a sarlat","restaurant à sarlat","restaurant a sarlat","table à sarlat","table a sarlat"],
      mots:["le malraux","malraux","restaurant","resto","cuisine périgourdine","cuisine perigourdine","gastronomie","manger à sarlat","manger a sarlat","restaurant à sarlat","restaurant a sarlat","table à sarlat","table a sarlat"],
      description:"Le Malraux à Sarlat : cuisine périgourdine, salle chaleureuse, photos et contact direct.",
      url:"https://malraux-entre2.digiylyfe.com/",
      wa:"Bonjour Le Malraux, je viens de DIGIYLYFE pour une demande à Sarlat."
    },
    {
      id:"sarlat-chez-baptiste",
      kind:"directory",
      public:true,
      priority:110,
      priorite:110,
      icon:"🛏️",
      title:"SARLAT CHEZ BAPTISTE — Chambre privée",
      titre:"SARLAT CHEZ BAPTISTE — Chambre privée",
      nom:"SARLAT CHEZ BAPTISTE",
      metier:"hébergement chez l’habitant",
      activite:"Chambre privée · Salle de bain privative · Arrivée autonome",
      categorie:"LOC",
      sousCategorie:"chambre-chez-habitant",
      secteur:"Sarlat",
      zones:["Sarlat","Périgord Noir","Dordogne"],
      statut:"fiche_officielle",
      labelStatut:"Fiche hébergement directe DIGIYLYFE",
      phone:"",
      whatsapp:"33638329423",
      keys:["sarlat chez baptiste","chez baptiste sarlat","chambre","chambre privée","chambre privee","chez l habitant","chez l’habitant","dormir","hébergement","hebergement","logement","nuit","78 euros","dormir à sarlat","dormir a sarlat","chambre à sarlat","chambre a sarlat"],
      mots:["sarlat chez baptiste","chez baptiste sarlat","chambre","chambre privée","chambre privee","chez l habitant","chez l’habitant","dormir","hébergement","hebergement","logement","nuit","78 euros","dormir à sarlat","dormir a sarlat","chambre à sarlat","chambre a sarlat"],
      description:"Chambre privée chez l’habitant à Sarlat, pour 2 voyageurs maximum, salle de bain privative, cuisine partagée et arrivée autonome de 16 h à 22 h. Demande directe.",
      url:"https://sarlat-chez-baptiste.digiylyfe.com/",
      wa:"Bonjour Baptiste, je viens d’ACTION PRO pour une demande directe à Sarlat."
    }
  ];'''
if fiche_anchor not in index:
    raise SystemExit('Ancre FICHES_DIRECTES introuvable')
index = index.replace(fiche_anchor, fiches_sarlat, 1)

response_anchor = '''      if(titleClean.includes("bcheikh")){
        return en'''
response_sarlat = '''      if(titleClean.includes("entre 2") || titleClean.includes("malraux")){
        return en
          ? "I understood: you want to eat in Sarlat. I bring up L’Entre 2 and Le Malraux with menus, photos and direct contact."
          : "J’ai compris : tu veux manger à Sarlat. Je te remonte L’Entre 2 et Le Malraux avec leurs cartes, leurs photos et le contact direct.";
      }
      if(titleClean.includes("sarlat chez baptiste")){
        return en
          ? "I understood: you want to stay in Sarlat. I bring up SARLAT CHEZ BAPTISTE, a private room with direct request and no DIGIYLYFE commission."
          : "J’ai compris : tu veux dormir à Sarlat. Je te remonte SARLAT CHEZ BAPTISTE, chambre privée chez l’habitant avec demande directe et 0 % de commission DIGIYLYFE.";
      }
''' + response_anchor
if response_anchor not in index:
    raise SystemExit('Ancre réponse directe introuvable')
index = index.replace(response_anchor, response_sarlat, 1)

expand_anchor = '    if(/\\b(outing|visit|discover|tour|activity|idea|place|petite cote|petite coast)\\b/.test(t)) extra += " sortie visite découvrir idée activité explore petite cote";'
expand_sarlat = expand_anchor + '\n    if(/\\b(sarlat|perigord|dordogne)\\b/.test(t)) extra += " sarlat périgord noir dordogne territoire";'
if expand_anchor not in index:
    raise SystemExit('Ancre expansion requête introuvable')
index = index.replace(expand_anchor, expand_sarlat, 1)

index = index.replace(
    'chauffeur, sortie, logement, réservation, bâtiment, commerce, boutique, travail, réseau, carnet, audio ou assistant.',
    'chauffeur, SARLAT, sortie, logement, réservation, bâtiment, commerce, boutique, travail, réseau, carnet, audio ou assistant.',
    1,
)

directory = directory.replace('Version : 20260720-bcheikh-v1', 'Version : 20260725-sarlat-v1', 1)
directory = directory.replace('const VERSION = "20260720-bcheikh-v1";', 'const VERSION = "20260725-sarlat-v1";', 1)
directory = directory.replace(
    '   vêtements    → BCHEIKH\n',
    '   vêtements    → BCHEIKH\n   restaurant Sarlat → L’Entre 2 + Le Malraux\n   chambre Sarlat    → SARLAT CHEZ BAPTISTE\n',
    1,
)

directory_anchor = '''    {
      id: "poulet-tonton",
      kind: "directory",'''
if directory_anchor not in directory:
    raise SystemExit('Ancre annuaire Poulet Tonton introuvable')

directory_entries = '''    {
      id: "sarlat-entre-2",
      kind: "directory",
      public: true,
      icon: "🍕",
      nom: "L’Entre 2",
      title: "L’Entre 2 — Restaurant à Sarlat",
      metier: "restaurant",
      activite: "Brasserie · Pizzeria · Terrasse",
      categorie: "RESA",
      sousCategorie: "restaurant",
      secteur: "Sarlat",
      zones: ["Sarlat", "Périgord Noir", "Dordogne"],
      statut: "fiche_officielle",
      labelStatut: "Fiche restaurant directe DIGIYLYFE",
      priorite: 110,
      phone: "33673274427",
      whatsapp: "",
      url: "https://malraux-entre2.digiylyfe.com/",
      description: "Brasserie, pizzeria et terrasse à Sarlat. Carte, photos et contact direct.",
      keys: ["l entre 2", "entre 2", "restaurant", "resto", "brasserie", "pizzeria", "pizza", "terrasse", "manger à sarlat", "restaurant à sarlat"],
      wa: "Bonjour L’Entre 2, je viens de DIGIYLYFE pour une demande à Sarlat."
    },
    {
      id: "sarlat-le-malraux",
      kind: "directory",
      public: true,
      icon: "🍷",
      nom: "Le Malraux",
      title: "Le Malraux — Restaurant à Sarlat",
      metier: "restaurant",
      activite: "Cuisine périgourdine · Salle chaleureuse",
      categorie: "RESA",
      sousCategorie: "restaurant",
      secteur: "Sarlat",
      zones: ["Sarlat", "Périgord Noir", "Dordogne"],
      statut: "fiche_officielle",
      labelStatut: "Fiche restaurant directe DIGIYLYFE",
      priorite: 109,
      phone: "33642160657",
      whatsapp: "",
      url: "https://malraux-entre2.digiylyfe.com/",
      description: "Cuisine périgourdine et salle chaleureuse à Sarlat. Photos et contact direct.",
      keys: ["le malraux", "malraux", "restaurant", "resto", "cuisine périgourdine", "gastronomie", "manger à sarlat", "restaurant à sarlat"],
      wa: "Bonjour Le Malraux, je viens de DIGIYLYFE pour une demande à Sarlat."
    },
    {
      id: "sarlat-chez-baptiste",
      kind: "directory",
      public: true,
      icon: "🛏️",
      nom: "SARLAT CHEZ BAPTISTE",
      title: "SARLAT CHEZ BAPTISTE — Chambre privée",
      metier: "hébergement chez l’habitant",
      activite: "Chambre privée · Salle de bain privative · Arrivée autonome",
      categorie: "LOC",
      sousCategorie: "chambre-chez-habitant",
      secteur: "Sarlat",
      zones: ["Sarlat", "Périgord Noir", "Dordogne"],
      statut: "fiche_officielle",
      labelStatut: "Fiche hébergement directe DIGIYLYFE",
      priorite: 110,
      phone: "",
      whatsapp: "33638329423",
      url: "https://sarlat-chez-baptiste.digiylyfe.com/",
      description: "Chambre privée chez l’habitant à Sarlat, salle de bain privative et arrivée autonome. Demande directe.",
      keys: ["sarlat chez baptiste", "chez baptiste sarlat", "chambre", "chambre privée", "chez l habitant", "dormir", "hébergement", "logement", "nuit", "dormir à sarlat", "chambre à sarlat"],
      wa: "Bonjour Baptiste, je viens d’ACTION PRO pour une demande directe à Sarlat."
    },

''' + directory_anchor
directory = directory.replace(directory_anchor, directory_entries, 1)

zone_anchor = '''    {
      canon: "Sénégal",
      mots: [
        "senegal"
      ]
    }'''
zone_sarlat = '''    {
      canon: "Sarlat",
      mots: [
        "sarlat",
        "sarlat la caneda",
        "perigord noir",
        "dordogne"
      ]
    },

''' + zone_anchor
if zone_anchor not in directory:
    raise SystemExit('Ancre ZONES annuaire introuvable')
directory = directory.replace(zone_anchor, zone_sarlat, 1)

required_index = [
    'action-pro-sarlat-territoire-20260725-v1',
    'aria-label="SARLAT"',
    'title:"SARLAT"',
    'title:"MANGER À SARLAT"',
    'title:"DORMIR À SARLAT"',
    'id:"sarlat-entre-2"',
    'id:"sarlat-le-malraux"',
    'id:"sarlat-chez-baptiste"',
    'https://digiylyfe.com/sarlat.html#manger',
    'https://digiylyfe.com/sarlat.html#dormir',
]
required_directory = [
    '20260725-sarlat-v1',
    'id: "sarlat-entre-2"',
    'id: "sarlat-le-malraux"',
    'id: "sarlat-chez-baptiste"',
    'canon: "Sarlat"',
]
for token in required_index:
    if token not in index:
        raise SystemExit('Contrôle index manquant : ' + token)
for token in required_directory:
    if token not in directory:
        raise SystemExit('Contrôle annuaire manquant : ' + token)

index_path.write_text(index, encoding="utf-8")
directory_path.write_text(directory, encoding="utf-8")
