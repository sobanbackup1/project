import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { Plus, Trash2 } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/ja';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('ja');
const localizer = momentLocalizer(moment);

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
  });

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      setAccessToken(response.access_token);
      await loadEvents(response.access_token);
    },
    scope: 'https://www.googleapis.com/auth/calendar',
  });

  const loadEvents = async (token: string) => {
    try {
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      const formattedEvents = data.items.map((event: any) => ({
        id: event.id,
        title: event.summary,
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const addEvent = async () => {
    if (!accessToken) return;

    try {
      const event = {
        summary: newEvent.title,
        start: {
          dateTime: newEvent.start.toISOString(),
          timeZone: 'Asia/Tokyo',
        },
        end: {
          dateTime: newEvent.end.toISOString(),
          timeZone: 'Asia/Tokyo',
        },
      };

      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (response.ok) {
        const createdEvent = await response.json();
        setEvents([
          ...events,
          {
            id: createdEvent.id,
            title: createdEvent.summary,
            start: new Date(createdEvent.start.dateTime),
            end: new Date(createdEvent.end.dateTime),
          },
        ]);
        setShowAddModal(false);
        setNewEvent({ title: '', start: new Date(), end: new Date() });
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setEvents(events.filter(event => event.id !== eventId));
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="h-[600px] p-4">
      {!accessToken ? (
        <div className="flex justify-center items-center h-full">
          <button
            onClick={() => login()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Googleカレンダーと連携する
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              予定を追加
            </button>
          </div>

          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            views={['month', 'week', 'day']}
            messages={{
              month: '月',
              week: '週',
              day: '日',
            }}
            selectable
            onSelectEvent={(event) => {
              if (window.confirm(`「${event.title}」を削除しますか？`)) {
                deleteEvent(event.id);
              }
            }}
          />

          {showAddModal && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                <h2 className="text-xl mb-4">新しい予定を追加</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    タイトル
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    開始時間
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        start: new Date(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    終了時間
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        end: new Date(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={addEvent}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    保存
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Calendar;
