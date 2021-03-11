import React, { useEffect, useMemo } from 'react';
import {
  SET_SCHEDULE,
  useSchedule,
} from '../../../../common/reducers/schedule';
import TableRow from './tableRow';

export default React.memo(
  ({
    activeYearTimetable,
    roomsData,
    isDraggingId,
    j,
    e,
    isPopupRoomOpen,
    setIsPopupRoomOpen,
    isPopupDescriptionOpen,
    setIsPopupDescriptionOpen,
  }: any) => {
    const lessonsCount =
      activeYearTimetable.betweenClasses.filter((t: number) => !!t).length + 1;
    const scheduleContext: any = useSchedule();

    useEffect(() => {
      let maxHeight = 0;
      const selector = `div[class*=singleFilteredDay${j}]`;
      const rowElements = document.querySelectorAll(selector);
      if (rowElements.length !== 0) {
        [].forEach.call(rowElements, (elem: any) => {
          elem.style.height = 'auto';
        });
        for (let i = 0; i < rowElements.length; i++) {
          const { height } = rowElements[i].getBoundingClientRect();
          if (maxHeight < height) maxHeight = height;
        }
        [].forEach.call(rowElements, (elem: any) => {
          elem.style.height = Math.round(maxHeight) + 'px';
        });
      }
    }, [j, scheduleContext, scheduleContext.schedule]);

    return (
      <div className={`gradeTimeSheetWrap`}>
        {useMemo(() => {
          const checkItemRoomDuplicates = (item: any, i: number) => {
            return item &&
              item.room &&
              scheduleContext.duplicates.includes(
                JSON.stringify({
                  day: j + 1,
                  lesson: 1 + i,
                  room: item.room.id,
                }),
              )
              ? 'duplicate'
              : '';
          };
          const checkTeacherDuplicates = (item: any, i: number) => {
            return item &&
              item.teacher &&
              scheduleContext.duplicates.includes(
                JSON.stringify({
                  day: j + 1,
                  lesson: 1 + i,
                  teacher: item.teacher.id,
                }),
              )
              ? 'duplicate'
              : '';
          };
          const dispatchRoom = ({
            isTwoItemsInRow,
            roomsInfoFirst,
            roomsInfoSecond,
            itemKey,
            item,
            itemSecond,
          }: any) => {
            if (isTwoItemsInRow) {
              if (roomsInfoFirst[0] && roomsInfoSecond[0]) {
                scheduleContext.dispatchSchedule({
                  type: SET_SCHEDULE,
                  data: {
                    ...scheduleContext.schedule,
                    [itemKey]: [
                      { ...item, room: roomsInfoFirst[0] },
                      { ...itemSecond, room: roomsInfoSecond[0] },
                    ],
                  },
                });
              }
            } else {
              if (roomsInfoFirst[0]) {
                scheduleContext.dispatchSchedule({
                  type: SET_SCHEDULE,
                  data: {
                    ...scheduleContext.schedule,
                    [itemKey]: [{ ...item, room: roomsInfoFirst[0] }],
                  },
                });
              }
            }
          };
          const addDescription = ({
            itemKey,
            choosenDescription,
            index,
          }: any) => {
            const elements = scheduleContext.schedule[itemKey];
            const changedElem = {
              ...elements[index],
              description: choosenDescription,
            };
            elements.splice(+index, 1);
            const newElements =
              index === 0
                ? [changedElem, ...elements]
                : [...elements, changedElem];

            scheduleContext.dispatchSchedule({
              type: SET_SCHEDULE,
              data: {
                ...scheduleContext.schedule,
                [itemKey]: newElements,
              },
            });
            setIsPopupDescriptionOpen('');
          };

          return Array.from(
            {
              length: lessonsCount,
            },
            (_, i) => {
              const key = JSON.stringify({
                day: j + 1,
                lesson: i + 1,
                grade: e.gradeLvl + e.letter,
              });
              const { day, lesson, grade, index }: any = isDraggingId
                ? JSON.parse(isDraggingId)
                : {};
              const isDraggingIdKey = JSON.stringify({ day, lesson, grade });
              const draggingItem =
                scheduleContext.schedule[isDraggingIdKey] &&
                scheduleContext.schedule[isDraggingIdKey][index];

              const item =
                scheduleContext.schedule[key] &&
                scheduleContext.schedule[key][0];
              const itemSecond =
                scheduleContext.schedule[key] &&
                scheduleContext.schedule[key][1];

              const draggableIdFirst = JSON.stringify({
                day: j + 1,
                lesson: i + 1,
                grade: e.gradeLvl + e.letter,
                index: 0,
              });
              const draggableIdSecond = JSON.stringify({
                day: j + 1,
                lesson: i + 1,
                grade: e.gradeLvl + e.letter,
                index: 1,
              });
              const isTwoItemsInRow = !!itemSecond && !!item;

              return (
                <div key={key}>
                  <TableRow
                    item={item}
                    itemSecond={itemSecond}
                    draggingItem={draggingItem}
                    isDropDisable={
                      isTwoItemsInRow
                        ? true
                        : !!draggingItem && !!draggingItem.group
                        ? !!item && !item.group
                        : !!item
                    }
                    isTwoItemsInRow={isTwoItemsInRow}
                    itemKey={key}
                    roomDuplicate={
                      checkItemRoomDuplicates(item, i) ||
                      checkItemRoomDuplicates(itemSecond, i)
                    }
                    firstTeacherDuplicate={checkTeacherDuplicates(item, i)}
                    secondTeacherDuplicate={checkTeacherDuplicates(
                      itemSecond,
                      i,
                    )}
                    setIsPopupDescriptionOpen={setIsPopupDescriptionOpen}
                    isFirstPopupDescriptionOpen={
                      isPopupDescriptionOpen === draggableIdFirst
                    }
                    isSecondPopupDescriptionOpen={
                      isPopupDescriptionOpen === draggableIdSecond
                    }
                    isPopupRoomOpen={isPopupRoomOpen === key}
                    dispatchRoom={dispatchRoom}
                    addDescription={addDescription}
                    isDraggingId={isDraggingId}
                    setIsPopupRoomOpen={setIsPopupRoomOpen}
                    roomsData={roomsData}
                    j={j}
                    i={i}
                    lessonsCount={lessonsCount}
                  />
                </div>
              );
            },
          );
        }, [
          isDraggingId,
          isPopupRoomOpen,
          scheduleContext,
          isPopupDescriptionOpen,
          setIsPopupDescriptionOpen,
          j,
          lessonsCount,
          roomsData,
          setIsPopupRoomOpen,
          e,
        ])}
      </div>
    );
  },
  (prevProps: any, nextProps: any) => {
    return (
      prevProps.isPopupRoomOpen === nextProps.isPopupRoomOpen &&
      prevProps.isPopupDescriptionOpen === nextProps.isPopupDescriptionOpen &&
      prevProps.roomsData === nextProps.roomsData &&
      prevProps.isDraggingId === nextProps.isDraggingId
    );
  },
);
