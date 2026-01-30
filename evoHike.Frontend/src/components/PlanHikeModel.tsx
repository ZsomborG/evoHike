import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { hikeService } from '../models/hikeService';
import Button from './Button';

interface PlanHikeModalProps {
  routeId: number;
  onClose: () => void;
  trailName: string;
}
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

const PlanHikeModal = ({ routeId, onClose, trailName }: PlanHikeModalProps) => {
  const { t } = useTranslation();

  const [dates, setDates] = useState({ start: '', end: '' });
  const [checklistOptions, setChecklistOptions] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    hikeService
      .getChecklistOptions()
      .then((data) => {
        if (isMounted) setChecklistOptions(data);
      })
      .catch(() => {
        if (isMounted) setError(t('plan.error_save'));
      });

    return () => {
      isMounted = false;
    };
  }, [t]);

  const handleCheck = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (new Date(dates.start) >= new Date(dates.end)) {
      setError(t('plan.error_date'));
      setLoading(false);
      return;
    }

    try {
      await hikeService.savePlannedHike({
        routeId,
        start: new Date(dates.start).toISOString(),
        end: new Date(dates.end).toISOString(),
        checklistItems: selectedItems,
      });

      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err: unknown) {
      console.error(err);
      setError(t('plan.error_save'));
    } finally {
      setLoading(false);
    }
  };

  const getTranslatedChecklistItem = (backendItem: string) => {
    const key = getTranslationKey(backendItem);
    if (key) {
      return t(`checklist.${key}`);
    }
    return backendItem;
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  };

  return (
    <div style={overlayStyle}>
      <div style={contentStyle}>
        <h2 style={{ marginTop: 0, textAlign: 'center', color: '#333' }}>
          {t('plan.title')}: <br />
          <span
            style={{ fontSize: '0.8em', color: '#666', fontWeight: 'normal' }}>
            {trailName}
          </span>
        </h2>

        {success ? (
          <div
            style={{
              color: 'green',
              textAlign: 'center',
              padding: '20px',
              fontSize: '1.2rem',
            }}>
            {t('plan.success')}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {error && (
              <div
                style={{
                  color: 'red',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                {error}
              </div>
            )}

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                  color: '#333',
                }}>
                {t('plan.start_date')}:
              </label>
              <input
                type="datetime-local"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
                onChange={(e) => setDates({ ...dates, start: e.target.value })}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                  color: '#333',
                }}>
                {t('plan.end_date')}:
              </label>
              <input
                type="datetime-local"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
                onChange={(e) => setDates({ ...dates, end: e.target.value })}
              />
            </div>

            <div>
              <h4 style={{ marginBottom: '10px', color: '#333' }}>
                {t('plan.checklist_title')}
              </h4>

              {checklistOptions.length === 0 && !error && (
                <p style={{ color: '#666' }}>Bet�lt�s...</p>
              )}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '8px',
                }}>
                {checklistOptions.map((item, idx) => (
                  <label
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      color: 'black',
                      fontSize: '1rem',
                      fontWeight: 'normal',
                    }}>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item)}
                      onChange={() => handleCheck(item)}
                    />
                    {getTranslatedChecklistItem(item)}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <div style={{ flex: 1 }}>
                <Button onClick={() => {}}>
                  {loading ? t('plan.saving') : t('plan.save')}
                </Button>
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer',
                  background: 'transparent',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  color: '#555',
                  fontWeight: 'bold',
                }}>
                {t('plan.cancel')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PlanHikeModal;
