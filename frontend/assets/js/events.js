const apiUrl = 'http://localhost:3000';
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'login.html';
}

document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});

const loadEvents = async () => {
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = '';
    try {
        const response = await fetch(`${apiUrl}/events`, {
            headers: { Authorization: token },
        });
        const events = await response.json();
        events.forEach(event => {
            const card = `
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${event.name}</h5>
                            <p class="card-text">${event.description}</p>
                            <p class="card-text"><strong>Local:</strong> ${event.location}</p>
                            <p class="card-text"><strong>Data:</strong> ${new Date(event.eventDate).toLocaleDateString()}</p>
                            <div class="card-actions">
                                <button class="btn btn-sm btn-outline-primary" onclick="editEvent(${event.id})">Editar</button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteEvent(${event.id})">Excluir</button>
                            </div>
                        </div>
                    </div>
                </div>`;
            eventsList.innerHTML += card;
        });
    } catch (err) {
        console.error(err);
        alert('Erro ao carregar eventos.');
    }
};

const saveEvent = async (event) => {
    event.preventDefault();
    const name = document.getElementById('eventName').value;
    const description = document.getElementById('eventDescription').value;
    const date = document.getElementById('eventDate').value;
    const location = document.getElementById('eventLocation').value;

    try {
        await fetch(`${apiUrl}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify({ name, description, location, eventDate: date }),
        });
        loadEvents();
        document.getElementById('eventForm').reset();
        new bootstrap.Modal(document.getElementById('eventModal')).hide();
    } catch (err) {
        console.error(err);
        alert('Erro ao salvar evento.');
    }
};

document.getElementById('eventForm').addEventListener('submit', saveEvent);
loadEvents();
