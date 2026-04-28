export const schedule = [
  ["07:30", "起床准备", "P0：起床、洗漱、早餐、出门；不刷短视频。P1：准时进入早通勤英语。"],
  ["08:00", "英语新词1", "P1：背50个新词。目标：不要切去招聘或短视频。完成时间：08:30。"],
  ["08:30", "英语新词2", "P1：再背50个新词。目标：早通勤累计新词100个。完成时间：09:00。"],
  ["09:00", "英语复习", "P1：复习100-150个词。目标：正确率向80%以上逼近。完成时间：09:30。"],
  ["09:30", "行业阅读", "P2：记录1条产品/AI/互联网洞察。完成时间：10:00。"],
  ["10:00", "上班启动", "P0：先处理实习基本事务。目标：当天工作事项清楚。完成时间：10:30。"],
  ["10:30", "Agent开发块1", "P1：推进一个Agent小模块。目标：可运行、可测试或问题明确。完成时间：12:00。"],
  ["12:00", "午间轻任务", "P0：午饭和恢复状态。P2：可记录1条产品洞察。完成时间：13:00。"],
  ["13:00", "求职复盘", "P1：新增1张面试卡片，优化1段项目表达。完成时间：14:00。"],
  ["14:00", "Agent开发块2", "P1：联调、Debug、写测试或保存版本。完成时间：15:30。"],
  ["15:30", "337理论课", "P2/P1：输出3个核心概念和1个可能考题。完成时间：16:30。"],
  ["16:30", "Agent文档/作品集", "P2：沉淀README、Demo脚本或简历描述一段。完成时间：17:30。"],
  ["17:30", "工作收尾+学校安全线", "P0：清实习和学校风险。目标：工作不拖，DDL无遗漏。完成时间：19:30。"],
  ["19:30", "晚通勤英语复习", "P1：复习约200个词。禁止刷岗位、改简历、短视频。完成时间：20:15。"],
  ["20:15", "面试表达回顾", "P1：口头复述1个项目问题，控制在3分钟内。完成时间：20:45。"],
  ["20:45", "晚间任务确认", "P1：确认21:30后跑哪个Demo或补哪个短板。完成时间：21:00。"],
  ["21:00", "回家缓冲", "P0：吃饭、洗澡、休息。目标：恢复状态。完成时间：21:30。"],
  ["21:30", "Agent整合/测试", "P1：跑Demo、修明显Bug、保存版本、写日志。完成时间：22:30。"],
  ["22:30", "英语/337补充", "P1/P2：补当天最短板，不开新战线。完成时间：23:20。"],
  ["23:20", "当日复盘", "P0/P1：写完成情况、未完成项、明天最重要一件事。完成时间：00:00。"],
  ["00:00", "睡前收尾", "P0：停止复杂开发和深度Debug。目标：00:30必须睡觉。"],
  ["00:20", "放松入睡", "P0：离开屏幕，准备睡觉。"],
];

function toMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function dueSlots(now = new Date(), windowMinutes = 5) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Hong_Kong",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const [{ value: hour }, , { value: minute }] = formatter.formatToParts(now);
  const current = Number(hour) * 60 + Number(minute);

  return schedule
    .map(([time, title, body]) => ({ time, title, body, minute: toMinutes(time) }))
    .filter((slot) => {
      const delta = (current - slot.minute + 1440) % 1440;
      return delta >= 0 && delta < windowMinutes;
    });
}

export function buildPushPayload(slot) {
  return JSON.stringify({
    title: `Raymond，现在是${slot.title}`,
    body: slot.body,
    tag: `raymond-server-${slot.time}`,
    url: "/mishu/#decision"
  });
}
