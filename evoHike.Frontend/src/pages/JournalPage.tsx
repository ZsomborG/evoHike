import { useTranslation } from 'react-i18next';
import { useApi } from '../hooks/useApi';

const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const getTranslationKey = (text: string): string | null => {
  if (!text) return null;
  const cleanText = normalizeText(text);

  if (cleanText.includes('viz') || cleanText.includes('1.5')) return 'water';

  if (cleanText.includes('esokabat') || cleanText.includes('valtoruha'))
    return 'raincoat';

  if (cleanText.includes('telefon') || cleanText.includes('powerbank'))
    return 'phone';

  if (cleanText.includes('terkep') || cleanText.includes('gps')) return 'map';

  if (cleanText.includes('elsosegely')) return 'first_aid';

  if (cleanText.includes('elelem') || cleanText.includes('energia'))
    return 'food';

  if (cleanText.includes('iranytu')) return 'compass';

  if (cleanText.includes('zseblampa')) return 'flashlight';

  return null;
};
interface RouteEntity {
  id: number;
  name: string;
}
interface PlannedHike {
  id: number;
  routeId: number;
  plannedStartDateTime: string;
  plannedEndDateTime: string;
  checklistJson: string;
  route?: RouteEntity;
}

const JournalPage = () => {
  const { t, i18n } = useTranslation();
  const {
    data: hikes,
    loading,
    error,
  } = useApi<PlannedHike[]>('/api/plannedhikes');

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';

    return new Date(dateString).toLocaleString(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const parseChecklist = (json: string): string[] => {
    try {
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  };

  const getTranslatedItems = (json: string) => {
    const items = parseChecklist(json);
    return items
      .map((item) => {
        const key = getTranslationKey(item);
        return key ? t(`checklist.${key}`) : item;
      })
      .join(', ');
  };

  if (loading)
    return (
      <div style={{ padding: '20px' }}>
        {t('plan.loading') || 'Betöltés...'}
      </div>
    );
  if (error)
    return <div style={{ color: 'red', padding: '20px' }}>Hiba: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('Travel Diary') || 'Túranapló'}</h1>

      {!hikes || hikes.length === 0 ? (
        <p>Nincs mentett túra.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {hikes.map((hike) => (
            <li
              key={hike.id}
              style={{
                marginBottom: '20px',
                borderBottom: '1px solid #ccc',
                paddingBottom: '15px',
              }}>
              <h3 style={{ margin: '0 0 10px 0' }}>
                {hike.route?.name || 'Ismeretlen túra'}
              </h3>

              <p style={{ margin: '5px 0' }}>
                <strong>{t('plan.start_date') || 'Kezdés'}:</strong>{' '}
                {formatDate(hike.plannedStartDateTime)}
              </p>

              <p style={{ margin: '5px 0' }}>
                <strong>{t('plan.end_date') || 'Vége'}:</strong>{' '}
                {formatDate(hike.plannedEndDateTime)}
              </p>

              <p style={{ margin: '5px 0' }}>
                <strong>{t('plan.checklist_title') || 'Felszerelés'}:</strong>{' '}
                {getTranslatedItems(hike.checklistJson) || 'Nincs'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JournalPage;
