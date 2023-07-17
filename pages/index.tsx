import React, { useState } from 'react';
import List from '../pages/components/List';
import styles from '../styles/home/home.module.css'
import { data } from '@/dummy-data/data';

const Home: React.FC = () => {

  return (
    <div className={styles.main}>
      <div className={styles.container}>
      <List items={data} />
      </div>
    </div>
  );
};

export default Home;
