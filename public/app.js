document.addEventListener('DOMContentLoaded', () => {
    const dollarRateElement = document.getElementById('dollarRate');
    const lastUpdateElement = document.getElementById('lastUpdate');
    const bolivarInput = document.getElementById('bolivarAmount');
    
    let rateData = null;

    // Format date to local string
    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleString('es-VE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Fecha no disponible';
        }
    };

    // Format time duration
    const formatDuration = (hours) => {
        if (hours < 1) {
            return `${Math.round(hours * 60)} minutos`;
        }
        const wholeHours = Math.floor(hours);
        const minutes = Math.round((hours - wholeHours) * 60);
        return `${wholeHours}h ${minutes}m`;
    };

    // Show error message
    const showError = (message) => {
        dollarRateElement.textContent = 'Error al cargar la tasa';
        dollarRateElement.classList.add('text-red-500');
        lastUpdateElement.textContent = message || 'Por favor, intente más tarde';
    };

    // Update calculations
    const updateCalculations = (bolivares) => {
        if (!rateData || !bolivares) {
            return;
        }

        try {
            const dollars = bolivares / rateData.price;
            const gigabytes = dollars; // Assuming 1 USD = 1 GB for this example

            // Calculate time for each service
            Object.entries(rateData.internetUsage).forEach(([service, data]) => {
                const hours = gigabytes / data.dataPerHour;
                const timeElement = document.getElementById(`${service}Time`);
                const dataElement = document.getElementById(`${service}Data`);

                if (timeElement && dataElement) {
                    timeElement.textContent = formatDuration(hours);
                    dataElement.textContent = `${gigabytes.toFixed(2)} GB`;
                }
            });
        } catch (error) {
            console.error('Error in calculations:', error);
            showError('Error en los cálculos');
        }
    };

    // Fetch rate data
    const fetchRate = async () => {
        try {
            dollarRateElement.textContent = 'Cargando...';
            dollarRateElement.classList.remove('text-red-500');

            const response = await fetch('/dolar');
            console.log('Response:', response);
            
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            rateData = await response.json();
            console.log('Rate data:', rateData);
            if (!rateData || typeof rateData.price !== 'number') {
                throw new Error('Datos inválidos del servidor');
            }

            dollarRateElement.textContent = `1 USD = ${rateData.price.toFixed(2)} Bs.`;
            lastUpdateElement.textContent = `Última actualización: ${formatDate(rateData.lastUpdate)}`;
            
            // Update calculations if there's a value in the input
            if (bolivarInput.value) {
                updateCalculations(parseFloat(bolivarInput.value));
            }
        } catch (error) {
            console.error('Error fetching rate:', error);
            showError(error.message);
        }
    };

    // Input event listener
    bolivarInput.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        updateCalculations(value);
    });

    // Initial fetch
    fetchRate();

    // Refresh rate every 5 minutes
    setInterval(fetchRate, 300000);
});
