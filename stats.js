export function initStats(peerConnection, domElement) {
  // window.setInterval(function() {
  //   peerConnection.getStats(null).then(stats => {
  //     let statsOutput = "";
  
  //     stats.forEach(report => {
  //       statsOutput += `<h2>Report: ${report.type}</h2>\n<strong>ID:</strong> ${report.id}<br>\n` +
  //                      `<strong>Timestamp:</strong> ${report.timestamp}<br>\n`;
  
  //       // Now the statistics for this report; we intentially drop the ones we
  //       // sorted to the top above
  
  //       Object.keys(report).forEach(statName => {
  //         if (statName !== "id" && statName !== "timestamp" && statName !== "type") {
  //           statsOutput += `<strong>${statName}:</strong> ${report[statName]}<br>\n`;
  //         }
  //       });
  //     });
  
  //     domElement.innerHTML = statsOutput;
  //   });
  // }, 1000);
}