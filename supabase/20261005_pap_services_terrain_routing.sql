-- LA VOIX — Services terrain / PAP Piscine
insert into public.digiy_intentions(code,label,module_code,rank_weight,requires_human_validation,is_active)
values ('chercher_service_terrain','Chercher un service terrain','TERRAIN',95,false,true)
on conflict (code) do update
set label=excluded.label,module_code=excluded.module_code,rank_weight=excluded.rank_weight,is_active=true;

-- Terms intention + métier are additive. Production migration applied 2026-10-05.
-- Key terms: piscine, pisciniste, entretien/nettoyage/traitement piscine,
-- jardinage, jardinier, entretien jardin, espaces verts, tonte, haies, désherbage.
