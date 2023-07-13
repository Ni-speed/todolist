import { ResponseType } from "common/types";
import { Dispatch } from "redux";
import { appActions } from "app/app-reducer";

/**
 * Обрабатывает ошибку, полученную от сервера, и обновляет состояние приложения.
 *
 * @template D - Тип данных, возвращаемых сервером.
 * @param {ResponseType<D>} data - Данные, полученные от сервера.
 * @param {Dispatch} dispatch - Функция диспетчера для обновления состояния приложения.
 * @param {boolean} [showError=true] - Флаг, указывающий, нужно ли отображать ошибку.
 * @returns {void}  ничего
 */
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch, showError: boolean = true) => {
  if (showError) {
    dispatch(appActions.setAppError({ error: data.messages.length ? data.messages[0] : "Some error occurred" }));
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
