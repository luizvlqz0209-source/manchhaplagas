document.getElementById('notify-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const emailInput = document.getElementById('user-email');
  const submitBtn = document.getElementById('submit-btn');
  const responseMsg = document.getElementById('form-response');

  const originalBtnText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';
  responseMsg.style.display = 'none';

  try {
    const res = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput.value })
    });

    if (res.ok) {
      responseMsg.style.display = 'block';
      responseMsg.style.color = '#2e7d32';
      responseMsg.textContent = '¡Hecho! Te hemos enviado un correo de confirmación.';
      emailInput.value = '';
    } else {
      throw new Error('Error en el envío');
    }
  } catch (err) {
    responseMsg.style.display = 'block';
    responseMsg.style.color = '#d32f2f';
    responseMsg.textContent = 'Hubo un error al enviar. Por favor, inténtalo de nuevo.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
});