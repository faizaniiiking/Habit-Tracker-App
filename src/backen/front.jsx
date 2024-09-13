import React, { useState } from 'react';
import { createStore } from 'redux';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardContent, Typography, Container, Grid, TextField } from '@material-ui/core';

// Redux setup
const ADD_HABIT = 'ADD_HABIT';
const TOGGLE_HABIT = 'TOGGLE_HABIT';

const addHabit = (habit) => ({ type: ADD_HABIT, payload: habit });
const toggleHabit = (id) => ({ type: TOGGLE_HABIT, payload: id });

const initialState = { habits: [] };

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_HABIT:
            return { ...state, habits: [...state.habits, { ...action.payload, completed: false }] };
        case TOGGLE_HABIT:
            return {
                ...state,
                habits: state.habits.map(habit =>
                    habit.id === action.payload ? { ...habit, completed: !habit.completed } : habit
                )
            };
        default:
            return state;
    }
};

const store = createStore(reducer);

// React Components
const HabitList = () => {
    const habits = useSelector(state => state.habits);
    const dispatch = useDispatch();

    const handleToggle = (id) => {
        dispatch(toggleHabit(id));
    };

    return (
        <div>
            {habits.map(habit => (
                <Card key={habit.id} style={{ marginBottom: '10px', backgroundColor: habit.completed ? '#d3ffd3' : '#fff' }}>
                    <CardContent>
                        <Typography variant="h5">{habit.name}</Typography>
                        <Typography variant="body2">{habit.description}</Typography>
                        <Button onClick={() => handleToggle(habit.id)}>{habit.completed ? 'Undo' : 'Complete'}</Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

const AddHabit = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = () => {
        if (name) {
            dispatch(addHabit({ id: Date.now(), name, description }));
            setName('');
            setDescription('');
        }
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <TextField
                label="Habit Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button onClick={handleSubmit} color="primary" variant="contained">Add Habit</Button>
        </div>
    );
};

const App = () => (
    <Provider store={store}>
        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <h1>Habit Tracker</h1>
                </Grid>
                <Grid item xs={12} md={6}>
                    <AddHabit />
                </Grid>
                <Grid item xs={12} md={6}>
                    <HabitList />
                </Grid>
            </Grid>
        </Container>
    </Provider>
);

export default App;
