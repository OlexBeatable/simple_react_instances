import React from 'react';

export const PlaceholderComponent = () => (
  <div style={{ width: 100 }}>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
    <p className={'bp3-skeleton'}>sit amet</p>
  </div>
);

export const SmallPlaceholderComponent = ({ length }: any) => (
  <div style={{ width: 100 }}>
    {Array.from({ length }, (_, i) => (
      <p key={'placeholder' + i} className={'bp3-skeleton'}>
        Lorem ipsum
      </p>
    ))}
  </div>
);
