const getSessionKey = (genericId) => {
    return `active_session:${genericId}`;
}

export default getSessionKey