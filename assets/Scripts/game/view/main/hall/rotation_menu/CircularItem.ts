import { Component, Vec2, Vec3, _decorator, v2, v3 } from 'cc';
import { CircularMenu } from './CircularMenu';
const { ccclass, property } = _decorator;

@ccclass('CircularItem')
export class CircularItem extends Component {
  isFollow: boolean
  index: number
  info: any
  parent: CircularMenu
  centerIndex: number
  target: Vec2
  direction: number
  speed: number = 8
  angle: number
  scaleBili: number = 3.25;
  show(index, info, parent) {
    this.index = index
    this.parent = parent
    this.target = v2(this.parent.radius, 0)
    this.node.setPosition(v3(this.parent.radius, 0))
    this.refreshItem(info)
  }

  refreshItem(info) {
    this.info = info
  }

  onClick() {
    this.angle = 0
    this.direction = this.getDirection()
    this.parent.onClick(this)
  }

  follow(item) {
    this.centerIndex = item.index
    if (item.index !== this.index) {
      this.angle = (this.index - item.index) * this.parent.interval
      if (item.direction === 0) {
        this.direction = this.getDirection()
      } else {
        this.direction = item.direction
      }
    }
    this.speed = 13
    this.isFollow = true
  }

  private pos3to2(pos: Vec3) {
    return v2(pos.x, pos.y);
  }

  resetPosScale(newOffset) {
    var angle = this.pos3to2(this.node.position).angle(this.target.rotate(this.angle - newOffset) as any)
    var pos = v2(this.node.position.x, this.node.position.y).rotate(this.direction * angle)
    this.node.setPosition(v3(pos.x, pos.y))
    var scale = this.pos3to2(this.node.position).angle(v2(this.parent.radius, 0)) / this.scaleBili
    this.node.scale = v3(1 - scale, 1 - scale, 1 - scale)
  }
  addIndex(item) {
    if (this === item) {
      this.index = 0
      return
    }
    this.index++
    this.centerIndex++

  }
  remIndex(item) {
    if (this === item) {
      this.index = this.parent.maxItemCount - 1
      return
    }
    this.index--
    this.centerIndex--
  }
  update(dt) {
    if (this.isFollow) {
      this.following(dt)
    }
  }
  getDirection(): number {
    var normalizLocal = v2(this.node.position.x, this.node.position.y).normalize();
    var newOffset = this.angle * this.node.scale.x * 0.5
    var normalizParent = v2(this.target.x, this.target.y).rotate(this.angle - newOffset).normalize()
    var dir = normalizLocal.cross(normalizParent)
    if (dir > 0) {
      return 1
    } else if (dir < 0) {
      return -1
    }
    return 0
  }

  following(dt) {
    var scale = Vec3.angle(this.node.position, v3(this.parent.radius, 0)) / this.scaleBili
    this.node.scale = v3(1 - scale, 1 - scale, 1 - scale)
    var newOffset = this.angle * scale * 0.5
    let rotationPos = this.target.clone().rotate(this.angle - newOffset)
    var angle = Vec3.angle(this.node.position, v3(rotationPos.x, rotationPos.y))
    var pos = v2(this.node.position.x, this.node.position.y).rotate(this.direction * angle * this.speed * 0.01)
    this.node.setPosition(v3(pos.x, pos.y))
    if (this.parent.maxItemCount > 1) {
      var bound = 1.5
      if (this.parent.maxItemCount === 2) {
        bound = 0.5
      }
      if (this.parent.maxItemCount === 3) {
        bound = 0.9
      }
      if (this.parent.maxItemCount === 4) {
        bound = 0.9
      }
      if (this.parent.maxItemCount === 5) {
        bound = 1.3
      }
      if (this.index === 0) {
        var left = Vec3.angle(this.node.position, v3(this.parent.radius, 0));
        if (left > bound && this.direction === -1) {
          this.parent.remIndexs(this)
          this.angle = (this.parent.maxItemCount - this.centerIndex) * this.parent.interval
          this.speed += 3
        }
      }
      if (this.index === this.parent.maxItemCount - 1) {
        var left = this.pos3to2(this.node.position).angle(v2(this.parent.radius, 0))
        if (left > bound && this.direction === 1) {
          this.parent.addIndexs(this)
          this.angle = -(this.centerIndex + 1) * this.parent.interval
          this.speed += 3
        }
      }
    }
    if (angle <= 0.01) {
      this.isFollow = false
      this.parent.onCenter(this.info)
    }
  }
}


