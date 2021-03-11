import React, { useEffect } from 'react';
import { H6, NumericInput, Tag } from '@blueprintjs/core';
import { roomType } from '../../../../common/translations/enums';
import { ROOM_TYPE } from '../../../../common/interfaces/const.enums';

export const SingleRoomInPopover = ({
  roomsData,
  item,
  isTwoColumns,
  choosenRoom,
  setChoosenRoom,
  roomsInfo,
}: any) => {
  useEffect(() => {
    setChoosenRoom(item.room ? item.room.number : 100);
  }, [item.room, setChoosenRoom]);

  const recommendation =
    roomsData && item
      ? roomsData.schoolCourseRooms.filter(
          (r: any) =>
            r.schoolCourse.id === item.workload.yearStudyplan.schoolCourse.id,
        )
      : [];

  return (
    <div
      className={'popoverForRooms'}
      style={{ maxWidth: isTwoColumns ? 130 : 200 }}>
      <H6 style={{ minHeight: 31, textAlign: 'center' }}>{item.name}</H6>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <NumericInput
          value={choosenRoom}
          onValueChange={h => {
            let value = h;
            if (choosenRoom - h === 1) {
              value = (roomsData
                ? roomsData.rooms
                    .sort((p: any, n: any) => n.number - p.number)
                    .find((r: any) => r.number <= h) || {
                    number: 0,
                  }
                : { number: 0 }
              ).number;
            } else if (h - choosenRoom === 1) {
              value = (roomsData
                ? roomsData.rooms
                    .sort((p: any, n: any) => p.number - n.number)
                    .find((r: any) => r.number >= h) || {
                    number: 599,
                  }
                : { number: 599 }
              ).number;
            }
            setChoosenRoom(value);
          }}
          leftIcon="sort-numerical"
          buttonPosition="left"
          clampValueOnBlur={true}
          min={0}
          max={599}
          stepSize={1}
        />
      </div>
      <H6 style={{ marginTop: 10, textAlign: 'center' }}>Інформація</H6>
      <div style={{ minHeight: 100 }}>
        {roomsInfo.length === 0 && (
          <div style={{ textAlign: 'center' }}>
            Аудиторії {choosenRoom} немає
          </div>
        )}
        {roomsInfo.map((r: any) => (
          <ul
            style={{ padding: '0 0 0 20px', margin: 0 }}
            key={r.id + 'roomPopup'}>
            <li>Номер: {r.number}</li>
            <li>Поверх: {r.flor}</li>
            <li>Місткість: {r.maxPeopleValue}</li>
            <li>Тип: {roomType[r.roomType]}</li>
            {r.roomType === ROOM_TYPE.SPECIAL && r.schoolCourse[0] && (
              <li>Предмет: {r.schoolCourse[0].name}</li>
            )}
          </ul>
        ))}
      </div>
      <H6 style={{ marginTop: 10, textAlign: 'center' }}>Рекомендовані</H6>
      <div style={{ textAlign: 'center' }}>
        {recommendation[0] && recommendation[0].room.length === 0 && (
          <div>
            Рекомендації відсутні. <br />
            Зайдіть в "Предметні аудиторії"
          </div>
        )}
        {recommendation[0] &&
          recommendation[0].room.length !== 0 &&
          recommendation[0].room.map((r: any) => (
            <Tag
              minimal={r.number === choosenRoom}
              style={{ margin: 2, cursor: 'pointer' }}
              onClick={() => setChoosenRoom(r.number)}
              key={r.id + 'tagsForRecommendRooms'}>
              {r.number}
            </Tag>
          ))}
      </div>
    </div>
  );
};
