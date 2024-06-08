// App.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { app } from './Firebase/Config/firebase'
import { Container, Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import { User } from './Firebase/Models/Users'

const db = getFirestore(app);

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const validateUser = (user) => {
    for (const [key, value] of Object.entries(user)) {
      if (User[key] && typeof value !== User[key]) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCol = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCol);
      const usersList = usersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => !validateUser(user));
      setUsers(usersList);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    await deleteDoc(doc(db, 'users', id));
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>User Management</Typography>
      {loading ? <p>Loading...</p> : (
        <List>
          {users.map(user => (
            <ListItem key={user.id}>
              <ListItemText primary={user.name} secondary={`Email: ${user.email}`} />
              <Button variant="contained" color="secondary" onClick={() => deleteUser(user.id)}>
                Delete
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default App;
