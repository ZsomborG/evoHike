import { useTranslation } from 'react-i18next';
import '../styles/TrailCard.css';
import { Trail } from '../models/Trail';

interface TrailCardProps {
  trail: Trail;
  onPlan: (trail: Trail) => void;
  onHover: (trailId: string | null) => void;
}

function TrailCard({ trail, onPlan, onHover }: TrailCardProps) {
  const { t } = useTranslation();

  return (
    <div
      className="trail-card-container"
      onMouseEnter={() => onHover(trail.id)}
      onMouseLeave={() => onHover(null)}>
      <div className="trail-card-bookmark">🔖</div>

      <div className="trail-card-header">
        <div className="trail-card-title-section">
          <div className="trail-card-icon-circle">
            <span className="trail-card-hiking-icon">🚶</span>
          </div>
          <div>
            <h2 className="trail-card-title">{trail.name}</h2>
            <p className="trail-card-difficulty-text">
              {t('trail.difficulty_label')}:
              <span className="trail-card-difficulty-value">
                {t(`trail.difficulties.${trail.difficulty}`)}
              </span>
            </p>
          </div>
        </div>
      </div>

      <hr className="trail-card-divider" />

      <div className="trail-card-content">
        <div className="trail-card-stats-section">
          <div>
            <div className="trail-card-stat-label">{t('trail.distance')}</div>
            <p className="trail-card-stat-value">{trail.length}m</p>
          </div>

          <div>
            <div className="trail-card-stat-label">{t('trail.elevation')}</div>
            <p className="trail-card-stat-value">{trail.elevationGain}m</p>
          </div>

          <div>
            <div className="trail-card-stat-label">{t('trail.duration')}</div>
            <p className="trail-card-stat-value">
              {trail.estimatedDuration
                ? `${Math.round(trail.estimatedDuration)} min`
                : '-'}
            </p>
          </div>

          <div>
            <div className="trail-card-stat-label">{t('trail.rating')}</div>
            <div className="trail-card-rating-wrapper">
              <span className="trail-card-stat-value">
                {trail.reviewCount ?? 0}
              </span>
              <div className="trail-card-vertical-line"></div>
              <span className="trail-card-rating-star">⭐</span>
              <span className="trail-card-stat-value">
                {trail.rating ?? 0.0}
              </span>
            </div>
          </div>
        </div>

        <div className="trail-card-right-section">
          <div className="trail-card-image-box">
            {trail.coverPhotoPath ? (
              <img
                src={trail.coverPhotoPath}
                alt={trail.name}
                className="trail-card-cover-image"
              />
            ) : (
              <span className="trail-card-placeholder-image">🖼️</span>
            )}
          </div>
          <button
            type="button"
            className="trail-card-action-btn"
            onClick={() => onPlan(trail)}>
            {t('trail.button_text')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TrailCard;
