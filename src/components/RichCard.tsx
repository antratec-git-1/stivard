import React from 'react';
import styles from './RichCard.module.css';

interface RichCardProps {
  title: string;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  price?: string;
  actionText: string;
}

export default function RichCard({ title, image, rating, reviews, description, price, actionText }: RichCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.image} />
        {price && <div className={styles.priceTag}>{price}</div>}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.ratingRow}>
          <span className={styles.stars}>
            {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
          </span>
          <span className={styles.reviews}>({reviews} Bewertungen)</span>
        </div>
        <p className={styles.description}>{description}</p>
        <button className={`btn-primary ${styles.actionButton}`}>
          {actionText}
        </button>
      </div>
    </div>
  );
}
