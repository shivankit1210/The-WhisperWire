const handleBlock = async () => {
  if (!user) return;
  const userDocRef = doc(db, "users", currentUser.id);

  try {
    await updateDoc(userDocRef, {
      blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
    });

    // Optional: Update local state or refetch data
    await userStore.fetchUserInfo(currentUser.id); // Ensure it updates
    changeBlock(); // Ensure it toggles correctly
  } catch (error) {
    console.log(error);
  }
};
