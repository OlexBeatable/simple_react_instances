import React, { useState } from 'react';
import {
  Button,
  Intent,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import { Droppable } from 'react-beautiful-dnd';
import { SingleDraggable } from './singleDraggable';
import { SingleRoomInPopover } from './singleRoomInPopover';

export default React.memo(
  ({
    i,
    setIsPopupRoomOpen,
    setIsPopupDescriptionOpen,
    isPopupRoomOpen,
    isFirstPopupDescriptionOpen,
    isSecondPopupDescriptionOpen,
    itemKey,
    roomDuplicate,
    firstTeacherDuplicate,
    secondTeacherDuplicate,
    dispatchRoom,
    item,
    itemSecond,
    isDropDisable,
    roomsData,
    lessonsCount,
    addDescription,
    isTwoItemsInRow,
  }: any) => {
    const [choosenRoomFirst, setChoosenRoomFirst] = useState(100);
    const [choosenRoomSecond, setChoosenRoomSecond] = useState(100);

    const roomsInfoFirst = roomsData
      ? roomsData.rooms.filter((r: any) => r.number === choosenRoomFirst)
      : [];
    const roomsInfoSecond = roomsData
      ? roomsData.rooms.filter((r: any) => r.number === choosenRoomSecond)
      : [];

    return (
      <div key={itemKey} className={'droppableWrapOverflow'}>
        {!item ? (
          <span className={'roomToScheduleWrap'} />
        ) : (
          <Popover
            enforceFocus={false}
            autoFocus={false}
            isOpen={isPopupRoomOpen}
            position={Position.BOTTOM_RIGHT}
            interactionKind={PopoverInteractionKind.CLICK}
            targetClassName={`roomToScheduleWrap clickable ${roomDuplicate}`}
            modifiers={{
              computeStyle: {
                gpuAcceleration: false,
              },
            }}
            target={
              <span>
                {item && item.room ? item.room.number : '-'}
                {isTwoItemsInRow ? '/' : ''}
                {itemSecond && itemSecond.room
                  ? itemSecond.room.number
                  : isTwoItemsInRow
                  ? '-'
                  : ''}
              </span>
            }
            onInteraction={isOpen => {
              setIsPopupRoomOpen(isOpen ? itemKey : '');
            }}
            usePortal={true}
            content={
              <div style={{ paddingBottom: 10 }}>
                <div style={{ display: 'flex' }}>
                  <SingleRoomInPopover
                    roomsData={roomsData}
                    item={item}
                    isTwoColumns={isTwoItemsInRow}
                    roomsInfo={roomsInfoFirst}
                    choosenRoom={choosenRoomFirst}
                    setChoosenRoom={setChoosenRoomFirst}
                  />
                  {itemSecond && (
                    <SingleRoomInPopover
                      roomsData={roomsData}
                      item={itemSecond}
                      isTwoColumns={isTwoItemsInRow}
                      roomsInfo={roomsInfoSecond}
                      choosenRoom={choosenRoomSecond}
                      setChoosenRoom={setChoosenRoomSecond}
                    />
                  )}
                </div>
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                  <Button
                    disabled={
                      isTwoItemsInRow
                        ? !roomsInfoFirst[0] || !roomsInfoSecond[0]
                        : !roomsInfoFirst[0] && !roomsInfoSecond[0]
                    }
                    onClick={() => {
                      dispatchRoom({
                        isTwoItemsInRow,
                        roomsInfoFirst,
                        roomsInfoSecond,
                        itemKey,
                        item,
                        itemSecond,
                      });
                      setIsPopupRoomOpen('');
                      setChoosenRoomFirst(100);
                      setChoosenRoomSecond(100);
                    }}
                    text={'Зберегти'}
                    icon="endorsed"
                    intent={Intent.SUCCESS}
                  />
                </div>
              </div>
            }
          />
        )}
        <Droppable
          direction="horizontal"
          droppableId={itemKey}
          isDropDisabled={isDropDisable}>
          {(droppableProvided, droppableSnapshot) => {
            return (
              <div
                className={`gradeTimeSheetRowDrop horizontal ${
                  droppableSnapshot.isDraggingOver ? 'dragging' : ''
                } ${item ? 'isGrade' : ''}`}
                ref={droppableProvided.innerRef}>
                {i < lessonsCount && (
                  <span className={'countNumberForSubjects'}>{i + 1}.</span>
                )}
                <SingleDraggable
                  itemKey={itemKey}
                  item={item}
                  isPopupDescriptionOpen={isFirstPopupDescriptionOpen}
                  setIsPopupDescriptionOpen={setIsPopupDescriptionOpen}
                  teacherDuplicates={firstTeacherDuplicate}
                  addDescription={addDescription}
                  index={0}
                  countLessonsCheck={i < lessonsCount}
                />
                {itemSecond && (
                  <SingleDraggable
                    itemKey={itemKey}
                    item={itemSecond}
                    isPopupDescriptionOpen={isSecondPopupDescriptionOpen}
                    setIsPopupDescriptionOpen={setIsPopupDescriptionOpen}
                    teacherDuplicates={secondTeacherDuplicate}
                    addDescription={addDescription}
                    index={1}
                    countLessonsCheck={i < lessonsCount}
                  />
                )}
                {droppableProvided.placeholder}
              </div>
            );
          }}
        </Droppable>
        {/*{item && item.hour !== 1 && (*/}
        {/*  <div style={{ height: 22 }}>Alternative</div>*/}
        {/*)}*/}
      </div>
    );
  },
  (prevProps: any, nextProps: any) => {
    return (
      prevProps.isPopupRoomOpen === nextProps.isPopupRoomOpen &&
      prevProps.roomsInfo === nextProps.roomsInfo &&
      prevProps.itemKey === nextProps.itemKey &&
      prevProps.roomsData === nextProps.roomsData &&
      prevProps.recommendation === nextProps.recommendation &&
      prevProps.item === nextProps.item &&
      prevProps.itemSecond === nextProps.itemSecond &&
      prevProps.isDropDisable === nextProps.isDropDisable &&
      prevProps.isTwoItemsInRow === nextProps.isTwoItemsInRow &&
      prevProps.isFirstPopupDescriptionOpen ===
        nextProps.isFirstPopupDescriptionOpen &&
      prevProps.isSecondPopupDescriptionOpen ===
        nextProps.isSecondPopupDescriptionOpen &&
      prevProps.roomDuplicate === nextProps.roomDuplicate &&
      prevProps.firstTeacherDuplicate === nextProps.firstTeacherDuplicate &&
      prevProps.secondTeacherDuplicate === nextProps.secondTeacherDuplicate
    );
  },
);
