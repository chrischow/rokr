import $ from 'jquery';
import 'jquery-circle-progress';

// UPDATE CIRCLE PROGRESS
$.circleProgress.defaults.drawValue = function(v, fontSize) {
    var ctx = this.ctx,
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

export default function updateCircleProgress(slug, progress, size, fontSize, emptyFill) {
    
    var team_progress = $('#' + slug).circleProgress({
        value: progress,     // Completion here
        size: size,     // Team: 150, overall: 250
        startAngle: - Math.PI / 2,
        fill: {  color: '#27DDCB' },
        emptyFill: "#010D1E8a"    // Team: #010D1E, Overall: #000718
    });
    
    team_progress.on('circle-animation-progress', function(event, progressValue, stepValue) {
        // $(this).data('circle-progress').drawValue(stepValue, fontSize);
        $(this).find('.progress-circle-value').text((100*stepValue).toFixed(0) + '%');
    });
}