document.addEventListener('DOMContentLoaded', function () {
  var currentDateElement = document.getElementById('currentDate');
  var currentDate = new Date();
  var options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  currentDateElement.textContent = currentDate.toLocaleDateString(
    'pt-BR',
    options
  );

  var daysContainer = document.getElementById('calendarDays');
  var eventsListElement = document.getElementById('eventsList');
  var alertsContainer = document.getElementById('alertsContainer');

  var events = {}; // Armazenar eventos

  function getEventColor(eventDate) {
    var eventDateTime = new Date(eventDate).getTime();
    var currentDateTime = currentDate.getTime();
    var timeDiff = eventDateTime - currentDateTime;
    var dayDiff = timeDiff / (1000 * 3600 * 24);

    if (dayDiff < 0) {
      return 'bg-danger'; // Vencido
    } else if (dayDiff < 3) {
      return 'bg-warning'; // Quase vencido
    } else {
      return 'bg-success'; // Longe do prazo
    }
  }

  function checkEventAlerts(eventDate) {
    var eventDateTime = new Date(eventDate).getTime();
    var currentDateTime = currentDate.getTime();
    var timeDiff = eventDateTime - currentDateTime;
    var dayDiff = timeDiff / (1000 * 3600 * 24);

    if (dayDiff === -1) {
      showAlert('O evento "' + events[eventDate] + '" está atrasado!');
    } else if (dayDiff === 1) {
      showAlert('O evento "' + events[eventDate] + '" é amanhã!');
    }
  }

  function showAlert(message) {
    var alertElement = document.createElement('div');
    alertElement.classList.add('alert', 'alert-info', 'mt-2');
    alertElement.textContent = message;
    alertsContainer.appendChild(alertElement);
    setTimeout(function () {
      alertElement.remove();
    }, 5000); // Remove o alerta após 5 segundos
  }

  function createCalendar(year, month) {
    var date = new Date(year, month - 1, 1);
    var lastDay = new Date(year, month, 0).getDate();
    var firstDayIndex = date.getDay();

    var days = '';

    // Preenche os dias do mês anterior, se necessário
    for (var i = 0; i < firstDayIndex; i++) {
      days += '<div class="day"></div>';
    }

    // Preenche os dias do mês atual
    for (var i = 1; i <= lastDay; i++) {
      var eventDate = year + '-' + month + '-' + i;
      var eventDay = events[eventDate];
      var dayClass = 'day';

      if (eventDay) {
        dayClass += ' event ' + getEventColor(eventDate);
        checkEventAlerts(eventDate);
      }

      days +=
        '<div class="' +
        dayClass +
        '" data-date="' +
        eventDate +
        '">' +
        i +
        '</div>';
    }

    daysContainer.innerHTML = days;

    // Adiciona evento de clique nos dias
    document.querySelectorAll('.day').forEach(function (day) {
      day.addEventListener('click', function () {
        var date = this.getAttribute('data-date');
        document.getElementById('eventDate').value = date;

        if (events[date]) {
          document.getElementById('eventName').value = events[date];
          document.getElementById('deleteEvent').style.display = 'block';
        } else {
          document.getElementById('eventName').value = '';
          document.getElementById('deleteEvent').style.display = 'none';
        }

        $('#eventModal').modal('show');
      });
    });

    // Atualiza a lista de eventos
    updateEventsList();

    // Atualiza o título do mês
    var monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    document.querySelector('.month h2').textContent = monthNames[month - 1] + ' ' + year;
  }

  function updateEventsList() {
    var eventsListHtml = '';

    for (var eventDate in events) {
      if (events.hasOwnProperty(eventDate)) {
        var eventName = events[eventDate];
        var eventColor = getEventColor(eventDate);
        eventsListHtml +=
          '<div class="event-item">' +
          '<div class="event-color-indicator ' +
          eventColor +
          '"></div>' +
          '<span class="event-date">' +
          new Date(eventDate).toLocaleDateString('pt-BR', options) +
          ':</span>' +
          '<span class="event-name">' +
          eventName +
          '</span>' +
          '</div>';
      }
    }

    eventsListElement.innerHTML = eventsListHtml;
  }

  // Manipula o envio do formulário de evento
  document.getElementById('eventForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var eventDate = document.getElementById('eventDate').value;
    var eventName = document.getElementById('eventName').value;

    // Adiciona ou atualiza o evento no objeto de eventos
    events[eventDate] = eventName;

    // Recria o calendário para mostrar o evento adicionado/atualizado
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth() + 1;
    createCalendar(currentYear, currentMonth);

    // Fecha o modal
    $('#eventModal').modal('hide');
  });

  // Manipula a exclusão do evento
  document.getElementById('deleteEvent').addEventListener('click', function () {
    var eventDate = document.getElementById('eventDate').value;
    delete events[eventDate];

    // Recria o calendário para mostrar o evento removido
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth() + 1;
    createCalendar(currentYear, currentMonth);

    // Fecha o modal
    $('#eventModal').modal('hide');
  });

  // Cria o calendário com os valores atuais
  var currentYear = currentDate.getFullYear();
  var currentMonth = currentDate.getMonth() + 1;
  createCalendar(currentYear, currentMonth);
});
