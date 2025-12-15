export function createFiberRoot(containerInfo: any): any {
  return {
    current: null,
    containerInfo,
  }
}
