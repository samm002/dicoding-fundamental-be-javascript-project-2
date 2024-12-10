const mapPlaylistSongActivitiesData = (data) => ({
  playlistId: data[0].playlistId,
  activities: data.map((row) => ({
    username: row.username,
    title: row.title,
    action: row.action,
    time: row.time,
  })),
});

module.exports = mapPlaylistSongActivitiesData;
