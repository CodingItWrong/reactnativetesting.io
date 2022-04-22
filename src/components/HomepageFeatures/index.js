import clsx from 'clsx';
import React from 'react';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Unit Tests',
    description: (
      <>Individual functions and plain JavaScript objects, using Jest.</>
    ),
  },
  {
    title: 'Component Tests',
    description: (
      <>
        For React Native components, using React Native Testing Library and
        jest-native.
      </>
    ),
  },
  {
    title: 'End-to-End Tests',
    description: <>Confirm your whole app is working together, using Detox.</>,
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
