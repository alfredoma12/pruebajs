async function convertir() {
  const pesos = document.getElementById("pesos").value;
  const moneda = document.getElementById("moneda").value;
  const resultado = document.getElementById("resultado");

  if (!pesos || !moneda) {
    resultado.textContent = "Por favor, ingrese el monto y seleccione una moneda.";
    return;
  }

  try {
    const res = await fetch("https://mindicador.cl/api/" + moneda);
    const data = await res.json();
    const valorActual = data.serie[0].valor;

    const conversion = (pesos / valorActual).toFixed(2);
    resultado.textContent = `Resultado: $${conversion}`;

    // Mostrar gráfico
    const labels = data.serie.slice(0, 10).map(d => d.fecha.slice(0, 10)).reverse();
    const valores = data.serie.slice(0, 10).map(d => d.valor).reverse();

    mostrarGrafico(labels, valores, moneda);
  } catch (error) {
    resultado.textContent = "❌ Error al obtener datos: " + error.message;
  }
}

let grafico;

function mostrarGrafico(fechas, valores, nombreMoneda) {
  const ctx = document.getElementById("grafico").getContext("2d");

  if (grafico) {
    grafico.destroy();
  }

  grafico = new Chart(ctx, {
    type: "line",
    data: {
      labels: fechas,
      datasets: [{
        label: `Historial últimos 10 días (${nombreMoneda})`,
        data: valores,
        fill: false,
        borderColor: "#ff4081",
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}
