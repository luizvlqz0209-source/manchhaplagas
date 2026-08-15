export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email requerido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 1. Petición a la API de Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Manchaplagas <info@manchaplagas.es>",
        to: [email],
        subject: "¡Bienvenido a Manchaplagas! Te mantendremos informado",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #2e7d32;">¡Gracias por registrarte!</h2>
            <p>Hola,</p>
            <p>Hemos recibido correctamente tu correo electrónico (<strong>${email}</strong>).</p>
            <p>Serás de los primeros en enterarte de todas nuestras novedades, promociones y servicios de control de plagas.</p>
            <br>
            <p>Un cordial saludo,<br><strong>El equipo de Manchaplagas</strong></p>
            <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;">
            <small style="color: #777;">Si no has solicitado este correo, puedes ignorarlo.</small>
          </div>
        `
      })
    });

    if (resendResponse.ok) {
      // 2. Registro en Google Sheets de forma privada
      try {
        await fetch(env.GOOGLE_SHEET_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, message: "Suscripción web" })
        });
      } catch (sheetError) {
        console.error("Error al guardar en Google Sheets:", sheetError);
        // No devolvemos error al usuario aquí porque el correo ya se envió correctamente
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    } else {
      const errorData = await resendResponse.text();
      return new Response(JSON.stringify({ error: errorData }), { status: 500 });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}