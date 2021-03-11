import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { studyDays } from '../../../../common/translations/enums';
import { GRADES_RELATIONS } from '../../../../common/interfaces/const.enums';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { PlaceholderComponent } from './placeholderComponent';
import './table.sass';
import {
  SET_DUPLICATES,
  SET_SCHEDULE,
  useSchedule,
} from '../../../../common/reducers/schedule';

const GradesColumn = lazy(() => import('./column'));

export const ScheduleTable = React.memo(
  ({
    activeYearTimetable,
    showSidebar,
    choosenEducationalDegree,
    workloads,
    scrollNode,
    roomsData,
  }: any) => {
    const [scrollPosition, setScrollPosition] = useState({ top: 0, left: 0 });
    const filteredStudyDays = Object.keys(studyDays).filter((e: any) =>
      activeYearTimetable.saturdaysOn ? true : +e !== 6,
    );
    const [isPopupRoomOpen, setIsPopupRoomOpen] = useState('');
    const [isPopupDescriptionOpen, setIsPopupDescriptionOpen] = useState('');

    const [isActive, setIsActive] = useState(0);
    const [isDraggingId, setIsDraggingId] = useState('');

    const scheduleContext: any = useSchedule();

    const checkForDuplicate = (schedule: any) => {
      const uniqTeachers: string[] = [];
      const uniqRooms: string[] = [];
      const duplicates: string[] = [];

      const checkRoomFunc = ({ day, lesson, item }: any) => {
        if (item) {
          const roomKey = JSON.stringify({
            day,
            lesson,
            room: item.room.id,
          });
          if (uniqRooms.includes(roomKey)) {
            !duplicates.includes(roomKey) && duplicates.push(roomKey);
          } else {
            uniqRooms.push(roomKey);
          }
        }
      };

      const checkTeacherFunc = ({ day, lesson, item }: any) => {
        if (item) {
          const teacherKey = JSON.stringify({
            day,
            lesson,
            teacher: item.teacher.id,
          });
          if (uniqTeachers.includes(teacherKey)) {
            !duplicates.includes(teacherKey) && duplicates.push(teacherKey);
          } else {
            uniqTeachers.push(teacherKey);
          }
        }
      };

      Object.keys(schedule).forEach((e: any) => {
        const { day, lesson } = JSON.parse(e);
        if (schedule[e][0] && schedule[e][0].teacher) {
          checkTeacherFunc({ day, lesson, item: schedule[e][0] });
        }
        if (schedule[e][1] && schedule[e][1].teacher) {
          checkTeacherFunc({ day, lesson, item: schedule[e][1] });
        }

        if (schedule[e][0] && schedule[e][0].room) {
          checkRoomFunc({ day, lesson, item: schedule[e][0] });
        }
        if (schedule[e][1] && schedule[e][1].room) {
          checkRoomFunc({ day, lesson, item: schedule[e][1] });
        }
      });
      return duplicates;
    };

    useEffect(() => {
      setIsActive(0);
      setIsDraggingId('');
      const duplicates = checkForDuplicate(scheduleContext.schedule);
      scheduleContext.dispatchDuplicates({
        type: SET_DUPLICATES,
        data: [...duplicates],
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scheduleContext.schedule, scheduleContext.dispatchDuplicates]);

    const onDragStart = (i: number, dragStartObj: any) => {
      setIsActive(i + 1);
      setIsDraggingId(dragStartObj.draggableId);
      setIsPopupRoomOpen('');
      setIsPopupDescriptionOpen('');
    };

    const onDragEnd = (result: any) => {
      setIsActive(0);
      setIsDraggingId('');
      if (!result.destination) return;

      const newSchedule = { ...scheduleContext.schedule };
      const placeKey = result.destination.droppableId;
      const { day, lesson, grade, index } = JSON.parse(result.draggableId);
      const itemKey = JSON.stringify({ day, lesson, grade });
      if (placeKey === itemKey) return;

      const { day: dropDay, lesson: dropLesson } = JSON.parse(placeKey);
      const data: any = { ...scheduleContext.schedule[itemKey][index] };

      const prevItem = newSchedule[placeKey] && newSchedule[placeKey][0];

      if (newSchedule[placeKey] && newSchedule[placeKey].length >= 2) return;
      if (newSchedule[itemKey].length === 2) {
        newSchedule[itemKey].splice(+index, 1);
      } else {
        delete newSchedule[itemKey];
      }

      newSchedule[placeKey] = [
        {
          ...data,
          day: dropDay,
          lesson: dropLesson,
        },
      ];
      if (prevItem) newSchedule[placeKey].unshift(prevItem);

      scheduleContext.dispatchSchedule({
        type: SET_SCHEDULE,
        data: { ...newSchedule },
      });
    };

    const workloadByGrades = useMemo(
      () =>
        workloads
          .reduce((r: any, e: any) => {
            if (
              GRADES_RELATIONS[choosenEducationalDegree].includes(
                e.schoolGrade.gradeLvl,
              )
            ) {
              const isGrade = r.find((g: any) => g.id === e.schoolGrade.id);
              if (isGrade) {
                isGrade.workload.push(e);
              } else {
                r.push({
                  ...e.schoolGrade,
                  workload: [e],
                });
              }
            }
            return r;
          }, [])
          .sort((p: any, n: any) => (p.letter > n.letter ? 1 : -1))
          .sort((p: any, n: any) => p.gradeLvl - n.gradeLvl),
      [workloads, choosenEducationalDegree],
    );
    const placeholdersCount = 6 - workloadByGrades.length;

    return (
      <div className={'scheduleTable'}>
        <OverlayScrollbarsComponent
          ref={scrollNode}
          options={{
            callbacks: {
              onScroll: (e: any) => {
                setIsPopupDescriptionOpen('');
                setIsPopupRoomOpen('');
                setScrollPosition({
                  top: e.target.scrollTop,
                  left: e.target.scrollLeft,
                });
              },
            },
          }}
          style={{
            width: `calc(100vw - ${showSidebar ? '300px' : '40px'})`,
            transition: '.5s',
            height: 'calc(100vh - 60px)',
          }}>
          <div className={'scheduleGradesList'}>
            {workloadByGrades.length === 0 && (
              <span style={{ position: 'absolute', top: 40, left: 10 }}>
                Спочатку створіть навантаження.
              </span>
            )}
            {workloadByGrades.map((e: any, i: number) => (
              <Suspense
                key={e.id + 'gradeWorkload'}
                fallback={<PlaceholderComponent />}>
                <GradesColumn
                  e={e}
                  i={i}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  isActive={isActive}
                  isDraggingId={isDraggingId}
                  scrollPosition={scrollPosition}
                  filteredStudyDays={filteredStudyDays}
                  activeYearTimetable={activeYearTimetable}
                  roomsData={roomsData}
                  isPopupRoomOpen={isPopupRoomOpen}
                  setIsPopupRoomOpen={setIsPopupRoomOpen}
                  isPopupDescriptionOpen={isPopupDescriptionOpen}
                  setIsPopupDescriptionOpen={setIsPopupDescriptionOpen}
                />
              </Suspense>
            ))}
            {placeholdersCount > 0 &&
              Array.from(
                {
                  length: placeholdersCount,
                },
                (_, i) => (
                  <div
                    key={i + 'placeholdersCount'}
                    style={{ width: '100%', backgroundColor: '#e6f2f7' }}>
                    <div
                      style={{
                        ...scrollPosition,
                        padding: 3,
                        height: 37,
                        backgroundColor: localStorage.getItem('theme') === 'dark'? '#30404d' : 'white',
                        position: 'absolute',
                        zIndex: 3,
                        borderBottom: '1px solid #808080',
                        width: '100%',
                      }}
                    />
                  </div>
                ),
              )}
          </div>
        </OverlayScrollbarsComponent>
      </div>
    );
  },
  (prevProps: any, nextProps: any) => {
    return (
      prevProps.showSidebar === nextProps.showSidebar &&
      prevProps.choosenEducationalDegree ===
        nextProps.choosenEducationalDegree &&
      prevProps.roomsData === nextProps.roomsData
    );
  },
);
