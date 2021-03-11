import React, { lazy, Suspense, useMemo } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Tag } from '@blueprintjs/core';
import { studyDays } from '../../../../common/translations/enums';
import { SmallPlaceholderComponent } from './placeholderComponent';

export default React.memo(
  ({
    e,
    i,
    roomsData,
    onDragStart,
    onDragEnd,
    isActive,
    isDraggingId,
    scrollPosition,
    filteredStudyDays,
    activeYearTimetable,
    isPopupRoomOpen,
    setIsPopupRoomOpen,
    isPopupDescriptionOpen,
    setIsPopupDescriptionOpen,
  }: any) => {
    const DroppableTable = useMemo(
      () => lazy(() => import('./droppableTable')),
      [],
    );

    return (
      <DragDropContext
        onDragStart={dragStart => {
          onDragStart(i, dragStart);
        }}
        onDragEnd={onDragEnd}>
        <div
          className={`gradeVerticalRow ${
            isActive === i + 1 ? 'active' : isActive !== 0 ? 'passive' : ''
          }`}>
          <div
            className={'columnGradeWrapper'}
            style={{
              top: scrollPosition.top,
            }}>
            <Tag style={{ padding: '5px 10px', margin: '0 2px' }} large>
              {e.gradeLvl + '-' + e.letter}
            </Tag>
          </div>
          {filteredStudyDays.map((s: any, j: number) => {
            return (
              <div
                key={i + 'singleFilteredDay' + j}
                className={i + 'singleFilteredDay' + j}
                style={{
                  position: 'relative',
                  marginTop: j === 0 ? 50 : 0,
                }}>
                {i === 0 && (
                  <div
                    className={`weekStudyDay`}
                    style={{ left: scrollPosition.left - 75 }}>
                    <Tag style={{ padding: '10px 5px' }} large>
                      {studyDays[s]}
                    </Tag>
                  </div>
                )}
                <Suspense fallback={<SmallPlaceholderComponent length={7} />}>
                  <DroppableTable
                    roomsData={roomsData}
                    activeYearTimetable={activeYearTimetable}
                    isPopupRoomOpen={isPopupRoomOpen}
                    setIsPopupRoomOpen={setIsPopupRoomOpen}
                    isPopupDescriptionOpen={isPopupDescriptionOpen}
                    setIsPopupDescriptionOpen={setIsPopupDescriptionOpen}
                    isActive={isActive}
                    isDraggingId={isDraggingId}
                    j={j}
                    i={i}
                    e={e}
                  />
                </Suspense>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    );
  },
  (prevProps: any, nextProps: any) => {
    return (
      prevProps.isActive === nextProps.isActive &&
      prevProps.scrollPosition === nextProps.scrollPosition &&
      prevProps.isPopupRoomOpen === nextProps.isPopupRoomOpen &&
      prevProps.isPopupDescriptionOpen === nextProps.isPopupDescriptionOpen &&
      prevProps.roomsData === nextProps.roomsData &&
      prevProps.isDraggingId === nextProps.isDraggingId
    );
  },
);
