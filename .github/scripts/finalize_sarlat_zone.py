from pathlib import Path

path = Path("index.html")
text = path.read_text(encoding="utf-8")
old = 'return ["saly","mbour","dakar","thies","thiès","ngaparou","somone","petite cote","petite côte"].includes(z);'
new = 'return ["saly","mbour","dakar","thies","thiès","ngaparou","somone","sarlat","sarlat la caneda","sarlat-la-caneda","perigord noir","périgord noir","dordogne","petite cote","petite côte"].includes(z);'
if old not in text:
    if new in text:
        raise SystemExit("Verrou territorial SARLAT déjà présent")
    raise SystemExit("Ancre isOnlyZoneWord introuvable")
text = text.replace(old, new, 1)
if new not in text:
    raise SystemExit("Contrôle final SARLAT échoué")
path.write_text(text, encoding="utf-8")
