import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import withLayout from '../components/withLayout';
import { COLORS } from '../theme';
import InterventionQuestion from './interventions/InterventionQuestion';
import QuestionItem from '../components/QuestionItem';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '2rem'
  },
  itemList: {
    backgroundColor: COLORS.LIGHT_GREY,
    border: '2px',
    width: 400
  }
}));

// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`,
    question: `Question ${k + offset}`,
    options: [{ value: 'value', text: 'option text' }],
    answerType: (k + offset) % 2 === 0 ? 'text' : 'select'
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? COLORS.GREEN : COLORS.LIGHT_GREY,

  // styles we need to apply on draggables
  ...draggableStyle
});

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const Interventions = ({ user, history }) => {
  const classes = useStyles();
  const [items, setItems] = useState(getItems(10));
  const [selectedItems, setSelectedItems] = useState(getItems(5, 10));

  const getList = id => (id === 'droppable' ? items : selectedItems);

  const onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );

      if (source.droppableId === 'droppable2') {
        setSelectedItems(items);
      } else {
        setItems(items);
      }
    } else {
      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );

      setItems(result.droppable);
      setSelectedItems(result.droppable2);
    }
  };

  const addOption = index => {
    let newSelectedItems = Array.from(selectedItems);
    newSelectedItems[index].options.push({ value: '', text: '' });
    setSelectedItems(newSelectedItems);
  };

  const deleteOption = (questionIndex, optionIndex) => {
    let newSelectedItems = Array.from(selectedItems);
    newSelectedItems[questionIndex].options.splice(optionIndex, 1);
    setSelectedItems(newSelectedItems);
  };

  return (
    <div className={classes.mainContainer}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={classes.itemList}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <QuestionItem
                      itemRef={provided.innerRef}
                      draggableProps={{
                        ...provided.draggableProps,
                        ...provided.dragHandleProps
                      }}
                      question={item.question}
                      answerType={item.answerType}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Droppable droppableId="droppable2">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={classes.itemList}
            >
              {selectedItems.map((selectedItem, index) => (
                <Draggable
                  key={selectedItem.id}
                  draggableId={selectedItem.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <InterventionQuestion
                      itemRef={provided.innerRef}
                      draggableProps={{
                        ...provided.draggableProps,
                        ...provided.dragHandleProps
                      }}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                      question={selectedItem.question}
                      options={selectedItem.options}
                      answerType={selectedItem.answerType}
                      addOption={() => addOption(index)}
                      deleteOption={optionIndex =>
                        deleteOption(index, optionIndex)
                      }
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(connect(mapStateToProps)(withLayout(Interventions)));
