import * as vscode from "vscode";
import { createAnswer } from "../service";
import { getDayId } from "../utils/getDayId";

export function postAnswer(document: vscode.TextDocument, content: string) {
  const { fileName } = document;
  const dayId = getDayId(fileName);
  if (!+dayId) {
    vscode.window.showErrorMessage("问题id不存在");
    return;
  }
  const answer = pickUserAnswer(content);
  if (!answer) {
    vscode.window.showErrorMessage("答案不能为空");
    return;
  }
  createAnswer(dayId, answer)
    .then((res) => {
      if (res.success) {
        vscode.window.showInformationMessage("提交成功");
      } else {
        vscode.window.showErrorMessage(res.errorMsg || "提交失败");
      }
    })
    .catch((e) => {
      vscode.window.showErrorMessage("网络异常");
      console.log(e);
    });
}

function pickUserAnswer(content: string): string {
  const regex = /\*\[interview\]: start(.*?)\*\[interview\]: end/s;
  const [, answer = ""] = regex.exec(content) || [];
  return answer.trim();
}
