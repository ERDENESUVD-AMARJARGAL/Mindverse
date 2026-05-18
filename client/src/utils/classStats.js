export const safeArray = (value) => Array.isArray(value) ? value : []

export function itemScores(item) {
    const submissions = safeArray(item?.submissions)
        .map(sub => Number(sub.score))
        .filter(Number.isFinite)

    if (submissions.length) return submissions

    const resultNum = Number(item?.resultNum)
    return Number.isFinite(resultNum) && resultNum > 0 ? [resultNum] : []
}

export function classScores(cls) {
    const activityScores = [
        ...safeArray(cls?.exams),
        ...safeArray(cls?.assignments),
    ].flatMap(itemScores)

    if (activityScores.length) return activityScores

    return safeArray(cls?.studentList)
        .map(student => Number(student.score))
        .filter(score => Number.isFinite(score) && score > 0)
}

export function average(scores) {
    return scores.length
        ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
        : 0
}

export function classAverage(cls) {
    const scores = classScores(cls)
    const avgNum = average(scores)
    return {
        avgNum,
        avg: scores.length ? `${avgNum}%` : '-',
        avgClass: scores.length ? (avgNum >= 80 ? 'good' : avgNum >= 60 ? 'mid' : 'low') : 'mid',
    }
}

export function studentScores(cls, studentId) {
    return [
        ...safeArray(cls?.exams),
        ...safeArray(cls?.assignments),
    ].flatMap(item => safeArray(item.submissions)
        .filter(sub => sub.studentId === studentId || sub.id === studentId)
        .map(sub => Number(sub.score))
        .filter(Number.isFinite)
    )
}

export function studentAverage(cls, studentId) {
    const scores = studentScores(cls, studentId)
    if (scores.length) return average(scores)

    const student = safeArray(cls?.studentList).find(s => s.id === studentId)
    const score = Number(student?.score)
    return Number.isFinite(score) ? score : 0
}
