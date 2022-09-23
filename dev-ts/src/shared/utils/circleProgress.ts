import $ from 'jquery';
import 'jquery-circle-progress';

// UPDATE CIRCLE PROGRESS
($ as any).circleProgress.defaults.drawValue = function (v: number, fontSize: string) {
  const ctx = this.ctx,
    s = this.size,
    sv = (100 * v).toFixed() + '%',
    fill = "#27DDCB";

  ctx.save();
  ctx.font = fontSize + " 'Bahnschrift Light'";    // Team: 25px, Overall: 35px
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = fill;
  ctx.fillText(sv, s / 2, s / 2);
  ctx.restore();
};

export default function updateCircleProgress(
  slug: string,
  progress: number,
  size: number,
  fontSize: string,
  emptyFill: string
) {
  const team_progress = ($('#' + slug) as any).circleProgress({
    value: progress,     // Completion here
    size: size,     // Team: 150, overall: 250
    startAngle: - Math.PI / 2,
    fill: { color: '#27DDCB' },
    emptyFill: "#010D1E8a"    // Team: #010D1E, Overall: #000718
  });

  team_progress.on('circle-animation-progress', function (
    event: any,
    progressValue: number,
    stepValue: number
  ) {
    team_progress.find('.progress-circle-value').text((100 * stepValue).toFixed(0) + '%');
  });
}