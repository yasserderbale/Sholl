import {
  createTeachersTable,
  insertTeacher,
  listTeachers,
  findTeacherById,
  updateTeacher,
  deleteTeacher,
  searchTeachersByName,
} from "../models/sqlite/TeacherModel";

export const addTeacher = async (identifiante: any, payload: any) => {
  if (!identifiante) return { StatusCode: 401, data: "no token" };
  if (!payload?.name) return { StatusCode: 400, data: "name is required" };
  createTeachersTable();
  const row = insertTeacher(payload);
  return { StatusCode: 200, data: row };
};

export const getTeachers = async (identifiante: any) => {
  if (!identifiante) return { StatusCode: 401, data: "no token" };
  createTeachersTable();
  const rows = listTeachers();
  return { StatusCode: 200, data: rows };
};

export const getTeacher = async (identifiante: any, id: string) => {
  if (!identifiante) return { StatusCode: 401, data: "no token" };
  const row = findTeacherById(id);
  if (!row) return { StatusCode: 404, data: "not found" };
  return { StatusCode: 200, data: row };
};

export const updateOneTeacher = async (
  identifiante: any,
  id: string,
  updates: any
) => {
  if (!identifiante) return { StatusCode: 401, data: "no token" };
  const row = updateTeacher(id, updates);
  return { StatusCode: 200, data: row };
};

export const deleteOneTeacher = async (identifiante: any, id: string) => {
  if (!identifiante) return { StatusCode: 401, data: "no token" };
  deleteTeacher(id);
  return { StatusCode: 200, data: "deleted" };
};

export const searchTeachers = async (identifiante: any, q: string) => {
  if (!identifiante) return { StatusCode: 401, data: "no token" };
  const rows = searchTeachersByName(q || "");
  return { StatusCode: 200, data: rows };
};


