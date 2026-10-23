import React from 'react';
import {
  Box,
  Calendar,
  Copy,
  Feather,
  FileText,
  HardDrive,
  Tag,
} from 'lucide-react';

const SOURCE_COPY = {
  text_to_3d: { label: 'Prompt', created: 'Created from prompt' },
  image_to_3d: { label: 'Image', created: 'Created from image' },
  images_to_3d: { label: 'Images', created: 'Created from images' },
  video_to_3d: { label: 'Video', created: 'Created from video' },
};

const formatCreated = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return `Today, ${time}`;
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;

  const day = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${day}, ${time}`;
};

const formatFileSize = (value) => {
  const size = Number(value);
  if (!size || Number.isNaN(size)) return '—';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const formatCount = (value) => {
  const count = Number(value);
  if (!count || Number.isNaN(count)) return '—';
  return count.toLocaleString('en-US');
};

const formatFromUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const clean = url.split('?')[0];
  const match = clean.match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toUpperCase() : '';
};

const fileTitle = (name, promptText, format) => {
  const ext = (format || 'GLB').replace(/^\./, '').toLowerCase();
  const rawName = String(name || '').trim();
  const usableName = rawName && !/^\d{8,}$/.test(rawName) ? rawName : '';
  let base = (usableName || promptText || 'Model').trim().replace(/^["']|["']$/g, '');
  if (base.length > 32) base = `${base.slice(0, 30).trim()}…`;
  if (/\.[a-z0-9]{2,5}$/i.test(base)) return base;
  return `${base}.${ext}`;
};

const ModelDetailsCard = ({
  projectMeta,
  projectType,
  generatedPrompt,
  modelUrl,
  thumbnail,
  onCopy,
}) => {
  const sourceKey = projectMeta?.type || projectType || 'text_to_3d';
  const source = SOURCE_COPY[sourceKey] || SOURCE_COPY.text_to_3d;
  const promptText = projectMeta?.prompt || generatedPrompt || '';
  const format =
    formatFromUrl(modelUrl) ||
    String(projectMeta?.fileType || '').replace(/^\./, '').toUpperCase() ||
    'GLB';
  const title = fileTitle(projectMeta?.name, promptText, format);
  const category = projectMeta?.category || '—';

  const rows = [
    { icon: Calendar, label: 'Created', value: formatCreated(projectMeta?.createdAt) },
    { icon: FileText, label: 'File Format', value: format },
    { icon: HardDrive, label: 'File Size', value: formatFileSize(projectMeta?.fileSize) },
    { icon: Box, label: 'Polygons', value: formatCount(projectMeta?.polygons) },
    { icon: Tag, label: 'Category', value: category },
  ];

  return (
    <div className="model-details-card">
      <div className="model-details-header">
        <div className="model-details-thumb">
          {thumbnail ? <img src={thumbnail} alt="" /> : <Box size={18} />}
        </div>
        <div className="model-details-heading">
          <span className="model-details-title" title={title}>{title}</span>
          <span className="model-details-badge">Generated</span>
        </div>
      </div>

      {promptText && (
        <div className="model-details-prompt">
          <p className="model-details-kicker">{source.created}</p>
          <div className="model-details-quote">
            <span>“{promptText}”</span>
            <button type="button" onClick={onCopy} aria-label="Copy prompt">
              <Copy size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="model-details-rows">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div className="model-details-row" key={row.label}>
              <span className="model-details-icon">
                <Icon size={16} />
              </span>
              <div>
                <div className="model-details-label">{row.label}</div>
                <div className="model-details-value">{row.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="model-details-divider" />

      <div className="model-details-source">
        <h6>Model Source</h6>
        <div className="model-details-row">
          <span className="model-details-icon">
            <Feather size={16} />
          </span>
          <div>
            <div className="model-details-label">{source.label}</div>
            <div className="model-details-value">{promptText || '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetailsCard;
