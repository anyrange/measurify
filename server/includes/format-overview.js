const formatOverview = (plays) => {
  if (!plays || !plays.length) return [];
  let overview = [];
  const firstDate = plays[plays.length - 1].date;
  const date = new Date();
  let day = date.toISOString().split("T")[0];

  while (day >= firstDate) {
    const play = plays.find((play) => play.date === day);

    if (play) {
      overview.push(play);
    } else {
      overview.push({ date: day, plays: 0, duration: 0 });
    }

    day = new Date(day);
    day.setDate(day.getDate() - 1);
    day = day.toISOString().split("T")[0];
  }

  return overview;
};

export default formatOverview;
