export abstract class Shape {
  private values: Map<string, string>;
  constructor(
    private readonly identifier: string,
    initial: Record<string, string> = {},
  ) {
    if (!identifier || /\s/.test(identifier)) throw new Error("invalid id");
    this.values = new Map(Object.entries(initial));
  }
  get id(): string {
    return this.identifier;
  }
  abstract get tag(): string;
  protected abstract get geometry(): readonly string[];
  protected abstract get horizontal(): readonly string[];
  protected abstract get vertical(): readonly string[];
  get children(): readonly Shape[] {
    return [];
  }
  get attributes(): ReadonlyMap<string, string> {
    return new Map(this.values);
  }
  get text(): string {
    return this.values.get("text") ?? "";
  }
  set(attr: string, value: string): void {
    if (
      ![
        ...this.geometry,
        "fill",
        "stroke",
        "stroke-width",
        ...(this.acceptsText ? ["text"] : []),
      ].includes(attr)
    )
      throw new Error(`unknown attribute: ${attr}`);
    if ([...this.geometry, "stroke-width"].includes(attr)) {
      if (!value.trim() || !Number.isFinite(Number(value)))
        throw new Error(`invalid number: ${value}`);
      if (
        ["width", "height", "r", "rx", "ry", "stroke-width"].includes(attr) &&
        Number(value) < 0
      )
        throw new Error(`${attr} must be non-negative`);
      value = String(Number(value));
    }
    this.values.set(attr, value);
  }
  protected get acceptsText(): boolean {
    return false;
  }
  importText(content: string): void {
    if (content.trim()) throw new Error(`unexpected text in <${this.tag}>`);
  }
  move(dx: number, dy: number): void {
    for (const key of this.horizontal)
      this.set(key, String(Number(this.values.get(key) ?? 0) + dx));
    for (const key of this.vertical)
      this.set(key, String(Number(this.values.get(key) ?? 0) + dy));
    for (const child of this.children) child.move(dx, dy);
  }
  scale(factor: number): void {
    if (!Number.isFinite(factor) || factor <= 0)
      throw new Error("scale factor must be positive");
    for (const key of this.geometry)
      this.set(key, String(Number(this.values.get(key) ?? 0) * factor));
    for (const child of this.children) child.scale(factor);
  }
  summary(): string {
    return `${this.tag}#${this.id}${[...this.values].map(([k, v]) => ` ${k}=${JSON.stringify(v)}`).join("")}`;
  }
  abstract clone(): Shape;
  protected copyInto(target: Shape): Shape {
    for (const [k, v] of this.values) target.set(k, v);
    return target;
  }
}
