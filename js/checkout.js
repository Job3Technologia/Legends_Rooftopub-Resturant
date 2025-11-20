document.addEventListener('DOMContentLoaded', function(){
  const itemsEl = document.getElementById('summary-items');
  const subtotalEl = document.getElementById('summary-subtotal');
  const deliveryEl = document.getElementById('summary-delivery');
  const totalEl = document.getElementById('summary-total');
  const form = document.getElementById('checkout-form');
  const toastContainer = document.getElementById('toast-container');

  let deliveryOption = 'delivery';

  function getCart(){ try { return JSON.parse(localStorage.getItem('legendsCart')||'[]'); } catch(_) { return []; } }
  function calcDelivery(){ return deliveryOption==='pickup'?0:35; }
  function currency(n){ return 'R'+n.toFixed(2); }
  function toast(msg,type){ const el=document.createElement('div'); el.className='toast '+(type||'info'); el.textContent=msg; toastContainer.appendChild(el); setTimeout(()=>{ if(el.parentNode) el.parentNode.removeChild(el); },3000); }
  function render(){ const cart=getCart(); itemsEl.innerHTML=''; let subtotal=0; cart.forEach(i=>{ const row=document.createElement('div'); row.className='summary-item'; row.innerHTML=`<span>${i.name} x ${i.quantity}</span><span>${currency(i.price*i.quantity)}</span>`; itemsEl.appendChild(row); subtotal+=i.price*i.quantity; }); const delivery=calcDelivery(); subtotalEl.textContent=currency(subtotal); deliveryEl.textContent=currency(delivery); totalEl.textContent=currency(subtotal+delivery); }

  document.getElementById('delivery-option').addEventListener('change', e=>{ deliveryOption=e.target.value; render(); });
  document.querySelectorAll('.payment-method').forEach(btn=>{ btn.addEventListener('click',()=>{ document.querySelectorAll('.payment-method').forEach(b=>b.classList.remove('selected')); btn.classList.add('selected'); }); });

  form.addEventListener('submit', function(e){ e.preventDefault(); const first=document.getElementById('first-name').value.trim(); const last=document.getElementById('last-name').value.trim(); const phone=document.getElementById('phone').value.trim(); const addr=document.getElementById('address').value.trim(); const method=document.querySelector('.payment-method.selected')?.dataset.method||''; if(!first||!last){ toast('Please enter your full name','error'); return; } if(!phone){ toast('Please enter your phone number','error'); return; } if(deliveryOption==='delivery' && !addr){ toast('Please enter your address','error'); return; } if(!method){ toast('Please select a payment method','error'); return; } const cart=getCart(); const orderNumber='LEG-2025-'+Math.floor(Math.random()*1000).toString().padStart(3,'0'); const lines=cart.map(i=>`${i.name} x ${i.quantity} = ${currency(i.price*i.quantity)}`).join('\n'); const d=calcDelivery(); const t=cart.reduce((s,i)=>s+i.price*i.quantity,0)+d; toast('Order confirmed','success'); const text=`Order ${orderNumber}\n${lines}\nDelivery: ${currency(d)}\nTotal: ${currency(t)}`; document.getElementById('share-order').setAttribute('href','https://wa.me/?text='+encodeURIComponent(text)); });

  render();
});