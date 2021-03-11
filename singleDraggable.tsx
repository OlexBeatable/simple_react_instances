import { Draggable } from 'react-beautiful-dnd';
import {
  Button,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import React, { useState } from 'react';

export const SingleDraggable = React.memo(
  ({
    countLessonsCheck,
    index,
    itemKey,
    item,
    teacherDuplicates,
    isPopupDescriptionOpen,
    addDescription,
    setIsPopupDescriptionOpen,
  }: any) => {
    const [choosenDescription, setChoosenDescription] = useState('Опис...');
    const { day, lesson, grade } = JSON.parse(itemKey);
    const draggableId = JSON.stringify({
      day,
      lesson,
      grade,
      index,
    });

    return (
      <Draggable isDragDisabled={!item} draggableId={draggableId} index={index}>
        {(draggableProvided, draggableSnapshot) => {
          return (
            <div
              className={`gradeTimeSheetRow ${
                item && item.group ? 'withGroup' : ''
              } ${teacherDuplicates} `}
              ref={draggableProvided.innerRef}
              {...draggableProvided.draggableProps}
              {...draggableProvided.dragHandleProps}
              style={{
                ...draggableProvided.draggableProps.style,
                border: draggableSnapshot.isDragging
                  ? '1px solid #4a4a4a'
                  : 'none',
                opacity: draggableSnapshot.isDragging ? '.7' : '1',
              }}>
              {item && countLessonsCheck ? (
                <Popover
                  enforceFocus={false}
                  autoFocus={false}
                  isOpen={isPopupDescriptionOpen}
                  onInteraction={isOpen => {
                    setIsPopupDescriptionOpen(isOpen ? draggableId : false);
                    setChoosenDescription(item.description || 'Опис...');
                  }}
                  position={Position.BOTTOM}
                  interactionKind={PopoverInteractionKind.CLICK}
                  popoverClassName={'fixWidthToPopoverSchedule'}
                  modifiers={{
                    computeStyle: {
                      gpuAcceleration: false,
                    },
                  }}
                  usePortal={true}
                  content={
                    <div style={{ padding: 10 }}>
                      Вчитель:{' '}
                      {item.teacher.lastName + ' ' + item.teacher.firstName}
                      <br />
                      Предмет: {item.name} <br />
                      {item.workload.yearStudyplan.makePair
                        ? 'Дозволено задвоювати'
                        : 'Не дозволено задвоювати'}
                      {` (ранг ${item.workload.yearStudyplan.schoolCourse.rank})`}
                      <br />
                      {item.group ? 'Група: ' + item.group.name : ''}
                      <textarea
                        className={'descriptionSchedule'}
                        value={choosenDescription}
                        onChange={t => setChoosenDescription(t.target.value)}
                        style={{
                          resize: 'none',
                          margin: '5px 0',
                        }}
                      />
                      <Button
                        onClick={() => {
                          addDescription({
                            itemKey,
                            choosenDescription,
                            index,
                          });
                          setChoosenDescription('Опис...');
                        }}
                        icon="plus"
                        minimal>
                        Додати опис
                      </Button>
                    </div>
                  }
                  target={
                    <div
                      className={`singleItemFromSchedule ${
                        item && item.group ? 'withDivider' : ''
                      }`}
                      style={{
                        width: item && item.group ? 80 : 200,
                        textDecoration: item.description ? 'underline' : 'none',
                      }}>
                      {item.name}
                    </div>
                  }
                />
              ) : (
                <span />
              )}
            </div>
          );
        }}
      </Draggable>
    );
  },
  // (prevProp, nextProp) => {
  //   return prevProp.isPopupDescriptionOpen === nextProp.isPopupDescriptionOpen;
  // },
);
