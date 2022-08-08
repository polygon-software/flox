// Private subnet only (public subnet is only necessary for SSR frontend)
resource "aws_subnet" "private_subnet" {
  count = 3
  cidr_block              = cidrsubnet(var.cidr_block, 5, count.index + var.web_pri_subnet_factor + var.web_pub_subnet_factor)
  map_public_ip_on_launch = false
  vpc_id                  = aws_vpc.vpc.id
  availability_zone       = var.azs[count.index]

  tags = {
    Name          = "${var.project}-${var.type}-private-subnet-${var.azs[count.index]}"
    SubnetType    = "private"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route_table_association" "frontend_route_table_association_private" {
  count                 = 3
  route_table_id        = aws_route_table.route_table_private.id
  subnet_id             = aws_subnet.private_subnet[count.index].id

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route_table" "route_table_private" {
  vpc_id                = aws_vpc.vpc.id
  tags = {
    Name          = "${var.project}-${var.type}-web-route-table-private"
    Project       = var.project
    SubnetType    = "private"
  }

  lifecycle {
    create_before_destroy = true
  }
}
