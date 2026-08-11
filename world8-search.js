/* ACTION PRO — WORLD8 search aliases. Keeps visible query, feeds canonical French terms to existing stable engine. production */
(function(){
  'use strict';
  if(window.__DIGIY_ACTION_WORLD8_SEARCH__)return;
  window.__DIGIY_ACTION_WORLD8_SEARCH__=true;
  var RULES=[
    [/\b(canalizador|canalizacao|canalização|encanador)\b/gi,' plombier plomberie '],
    [/\b(eletricista|electricista)\b/gi,' electricien électricien '],
    [/\b(pedreiro|alvenaria|empreiteiro)\b/gi,' macon maçon construction artisan '],
    [/\b(motorista|condutor|chauffeur|driver)\b/gi,' chauffeur driver '],
    [/\b(alojamento|quarto|hospedagem|estadia|dormida)\b/gi,' logement chambre hebergement dormir loc '],
    [/\b(restaurante|mesa|jantar|almoco|almoço)\b/gi,' restaurant table reservation manger '],
    [/\b(reservar|reserva)\b/gi,' reserver réservation '],
    [/\b(loja|comercio|comércio|mercado)\b/gi,' boutique commerce market '],
    [/\b(produto|artigo|comprar|compra)\b/gi,' produit boutique acheter market '],
    [/\b(emprego|trabalho|vaga|missao|missão)\b/gi,' emploi travail job mission '],
    [/\b(anuncio|anúncio|publicar)\b/gi,' annonce publier reseau réseau '],
    [/\b(pagamento|pagar|comprovativo|recibo)\b/gi,' paiement payer preuve carnet wave '],
    [/\b(solar|painel|paineis|painéis|bateria)\b/gi,' solaire panneau batterie energie '],
    [/\b(reparacao|reparação|conserto|avaria)\b/gi,' réparation depannage artisan build '],
    [/\b(beleza|unhas|manicure|massagem)\b/gi,' beauté ongles onglerie massage ']
  ];
  function canonical(raw){
    var out=' '+String(raw||'')+' ';
    RULES.forEach(function(r){out=out.replace(r[0],function(m){return m+' '+r[1]})});
    return out.replace(/\s+/g,' ').trim();
  }
  function q(){return document.getElementById('q')}
  function temporaryCanonical(){
    var el=q();if(!el||!el.value)return;
    var original=el.value,next=canonical(original);if(next===original)return;
    el.value=next;
    queueMicrotask(function(){if(el.value===next)el.value=original});
  }
  document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('#searchBtn'))temporaryCanonical()},true);
  document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target===q()&&!e.shiftKey)temporaryCanonical()},true);
  window.DIGIY_ACTION_WORLD8_CANONICAL=canonical;
})();